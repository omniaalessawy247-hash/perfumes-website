import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchAdminOrders, updateOrderStatus, type AdminOrder } from '../../lib/api'
import { formatPrice } from '../../lib/format'
import AdminShell from './AdminShell'
import OrderDrawer from './OrderDrawer'
import {
  IconAlert,
  IconCheckCircle,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconDownload,
  IconInbox,
  IconPhone,
  IconRefresh,
  IconSearch,
  IconTrend,
  IconTruck,
  IconWallet,
  IconWhatsApp,
  IconXCircle,
} from './adminIcons'
import {
  STATUSES,
  avatarTint,
  downloadOrdersCsv,
  formatShort,
  initials,
  perfumeColor,
  perfumeName,
  timeAgo,
  whatsappLink,
} from './adminUtils'
import './admin.css'

const PAGE_SIZE = 10

type SortKey = 'newest' | 'oldest' | 'highest' | 'lowest'
const SORTS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest total' },
  { value: 'lowest', label: 'Lowest total' },
]

const STATUS_ICON = {
  New: IconClock,
  Confirmed: IconCheckCircle,
  Delivered: IconTruck,
  Cancelled: IconXCircle,
} as const

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ text: string; tone: 'ok' | 'error' } | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const load = useCallback(async () => {
    setRefreshing(true)
    try {
      setOrders(await fetchAdminOrders())
      setError('')
      setUpdatedAt(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load orders.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Load once, then poll every minute
  useEffect(() => {
    void load()
    const timer = window.setInterval(() => void load(), 60_000)
    return () => window.clearInterval(timer)
  }, [load])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = (text: string, tone: 'ok' | 'error' = 'ok') => {
    window.clearTimeout(toastTimer.current)
    setToast({ text, tone })
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: orders.length }
    for (const status of STATUSES) result[status] = 0
    for (const order of orders) result[order.status] = (result[order.status] ?? 0) + 1
    return result
  }, [orders])

  const stats = useMemo(() => {
    const active = orders.filter((order) => order.status !== 'Cancelled')
    const revenue = active.reduce((sum, order) => sum + order.total_egp, 0)

    const days = Array.from({ length: 7 }, (_, index) => {
      const day = new Date()
      day.setHours(0, 0, 0, 0)
      day.setDate(day.getDate() - (6 - index))
      return { key: day.toDateString(), label: day.toLocaleDateString('en-GB', { weekday: 'short' }), today: index === 6, orders: 0, revenue: 0 }
    })
    for (const order of active) {
      const slot = days.find((day) => day.key === new Date(order.created_at).toDateString())
      if (slot) {
        slot.orders += 1
        slot.revenue += order.total_egp
      }
    }

    const units: Record<string, number> = {}
    for (const order of active) {
      for (const item of order.order_items) units[item.product_id] = (units[item.product_id] ?? 0) + item.quantity
    }
    const perfumeUnits = Object.entries(units)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)

    return {
      revenue,
      activeCount: active.length,
      average: active.length ? Math.round(revenue / active.length) : 0,
      days,
      maxDay: Math.max(1, ...days.map((day) => day.revenue)),
      weekRevenue: days.reduce((sum, day) => sum + day.revenue, 0),
      perfumeUnits,
      maxUnits: Math.max(1, ...perfumeUnits.map((entry) => entry.count)),
    }
  }, [orders])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (!q) return true
      return (
        order.order_number.toLowerCase().includes(q) ||
        order.customer_name.toLowerCase().includes(q) ||
        order.phone.includes(q)
      )
    })
    list.sort((a, b) => {
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sort === 'highest') return b.total_egp - a.total_egp
      if (sort === 'lowest') return a.total_egp - b.total_egp
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    return list
  }, [orders, query, statusFilter, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const selected = orders.find((order) => order.id === selectedId) ?? null
  const hasFilters = query.trim() !== '' || statusFilter !== 'all'

  const changeStatus = async (order: AdminOrder, status: string) => {
    if (status === order.status) return
    const previous = order.status
    setOrders((current) => current.map((o) => (o.id === order.id ? { ...o, status } : o)))
    try {
      await updateOrderStatus(order.id, status)
      showToast(order.order_number + ' marked as ' + status)
    } catch (err) {
      setOrders((current) => current.map((o) => (o.id === order.id ? { ...o, status: previous } : o)))
      const message = err instanceof Error ? err.message : 'Could not update this order.'
      setError(message)
      showToast(message, 'error')
    }
  }

  const applyStatus = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  const clearFilters = () => {
    setQuery('')
    setStatusFilter('all')
    setPage(1)
  }

  const closeDrawer = useCallback(() => setSelectedId(null), [])

  const statCards = [
    {
      label: 'Revenue',
      value: formatPrice(stats.revenue),
      hint: stats.activeCount + (stats.activeCount === 1 ? ' active order' : ' active orders'),
      Icon: IconWallet,
      tone: 'amber',
    },
    {
      label: 'New orders',
      value: String(counts.New),
      hint: counts.New ? 'Waiting for confirmation' : 'All caught up',
      Icon: IconClock,
      tone: 'rose',
      action: counts.New ? () => applyStatus('New') : undefined,
    },
    {
      label: 'Delivered',
      value: String(counts.Delivered),
      hint: orders.length ? Math.round((counts.Delivered / orders.length) * 100) + '% of all orders' : 'No orders yet',
      Icon: IconTruck,
      tone: 'green',
    },
    {
      label: 'Average order',
      value: formatPrice(stats.average),
      hint: 'Across active orders',
      Icon: IconTrend,
      tone: 'sage',
    },
  ]

  const topbarActions = (
    <>
      {updatedAt && (
        <span className="adm-updated" title="Refreshes automatically every minute">
          <i /> Updated {updatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
      <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => void load()} disabled={refreshing}>
        <IconRefresh size={16} className={refreshing ? 'adm-spin' : ''} />
        <span className="adm-hide-sm">Refresh</span>
      </button>
    </>
  )

  return (
    <AdminShell newCount={counts.New} actions={topbarActions}>
      <div className="adm-page-head">
        <p className="adm-eyebrow">Dashboard</p>
        <h1 className="serif">Orders</h1>
        <p className="adm-sub">Review, confirm and deliver your customers' orders.</p>
      </div>

      {error && (
        <p className="adm-alert" role="alert">
          <IconAlert size={17} />
          <span>{error}</span>
          <button onClick={() => void load()}>Try again</button>
        </p>
      )}

      <div className="adm-stats">
        {statCards.map(({ label, value, hint, Icon, tone, action }) => (
          <article key={label} className={'adm-card adm-stat tone-' + tone}>
            <span className="adm-stat-icon">
              <Icon size={20} />
            </span>
            <p className="adm-eyebrow">{label}</p>
            {loading ? <span className="adm-skel adm-skel-lg" /> : <p className="adm-stat-value serif">{value}</p>}
            <p className="adm-stat-hint">
              {hint}
              {action && (
                <button className="adm-link" onClick={action}>
                  Review
                </button>
              )}
            </p>
          </article>
        ))}
      </div>

      <div className="adm-insights">
        <article className="adm-card adm-panel">
          <header className="adm-panel-head">
            <div>
              <h2>Last 7 days</h2>
              <p>{formatPrice(stats.weekRevenue)} in revenue</p>
            </div>
          </header>
          <div className="adm-bars" role="img" aria-label="Revenue for the last 7 days">
            {stats.days.map((day) => (
              <div key={day.key} className={'adm-bar' + (day.today ? ' is-today' : '')} title={day.label + ': ' + formatPrice(day.revenue) + ' · ' + day.orders + ' orders'}>
                <span className="adm-bar-count">{day.orders || ''}</span>
                <span className="adm-bar-track">
                  <span className="adm-bar-fill" style={{ height: day.revenue ? Math.max(6, (day.revenue / stats.maxDay) * 100) + '%' : '0%' }} />
                </span>
                <span className="adm-bar-label">{day.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="adm-card adm-panel">
          <header className="adm-panel-head">
            <div>
              <h2>By perfume</h2>
              <p>Bottles sold, cancelled orders excluded</p>
            </div>
          </header>
          {stats.perfumeUnits.length === 0 ? (
            <p className="adm-muted-note">Sales will appear here once orders come in.</p>
          ) : (
            <ul className="adm-rank">
              {stats.perfumeUnits.map(({ id, count }) => (
                <li key={id}>
                  <span className="adm-rank-name">
                    <i style={{ background: perfumeColor(id) }} />
                    {perfumeName(id)}
                  </span>
                  <span className="adm-rank-track">
                    <span style={{ width: (count / stats.maxUnits) * 100 + '%', background: perfumeColor(id) }} />
                  </span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <section className="adm-card adm-orders">
        <div className="adm-toolbar">
          <label className="adm-search">
            <IconSearch size={18} />
            <input
              placeholder="Search by order #, name or phone"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              aria-label="Search orders"
            />
          </label>
          <div className="adm-select">
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} aria-label="Sort orders">
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <IconChevronDown size={16} />
          </div>
          <button className="adm-btn adm-btn-solid adm-btn-sm" onClick={() => downloadOrdersCsv(filtered)} disabled={filtered.length === 0}>
            <IconDownload size={16} />
            <span className="adm-hide-sm">Export CSV</span>
          </button>
        </div>

        <div className="adm-chips" role="tablist" aria-label="Filter by status">
          {['all', ...STATUSES].map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={statusFilter === value}
              className={'adm-chip' + (statusFilter === value ? ' is-active' : '')}
              onClick={() => applyStatus(value)}
            >
              {value === 'all' ? 'All orders' : value}
              <span>{counts[value] ?? 0}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="adm-skel-rows" aria-busy="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className="adm-skel adm-skel-row" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <span className="adm-empty-icon">
              <IconInbox size={28} />
            </span>
            <h3 className="serif">{hasFilters ? 'No orders match' : 'No orders yet'}</h3>
            <p>{hasFilters ? 'Try a different search or status.' : 'When a customer checks out, their order will appear here.'}</p>
            {hasFilters && (
              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="adm-table-wrap" data-lenis-prevent="">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((order) => {
                    const StatusIcon = STATUS_ICON[order.status as keyof typeof STATUS_ICON] ?? IconClock
                    const extra = order.order_items.length - 2
                    return (
                      <tr key={order.id} onClick={() => setSelectedId(order.id)}>
                        <td data-label="Order">
                          <button className="adm-order-no" onClick={() => setSelectedId(order.id)}>
                            {order.order_number}
                          </button>
                          <small title={new Date(order.created_at).toLocaleString('en-GB')}>{timeAgo(order.created_at)} · {formatShort(order.created_at)}</small>
                        </td>
                        <td data-label="Customer">
                          <div className="adm-cust">
                            <span className="adm-avatar" style={{ background: avatarTint(order.customer_name) }}>
                              {initials(order.customer_name)}
                            </span>
                            <span>
                              <strong>{order.customer_name}</strong>
                              <small dir="ltr">{order.phone}</small>
                            </span>
                          </div>
                        </td>
                        <td data-label="Items">
                          <ul className="adm-items">
                            {order.order_items.slice(0, 2).map((item, index) => (
                              <li key={item.product_id + item.size_ml + index}>
                                <i style={{ background: perfumeColor(item.product_id) }} />
                                {perfumeName(item.product_id)} <b>{item.size_ml}ml</b> ×{item.quantity}
                              </li>
                            ))}
                            {extra > 0 && <li className="adm-items-more">+{extra} more</li>}
                          </ul>
                        </td>
                        <td data-label="Total" className="adm-total-cell">
                          {formatPrice(order.total_egp)}
                        </td>
                        <td data-label="Status" onClick={(event) => event.stopPropagation()}>
                          <div className={'adm-status status-' + order.status.toLowerCase()}>
                            <StatusIcon size={15} />
                            <select value={order.status} onChange={(event) => void changeStatus(order, event.target.value)} aria-label={'Status of ' + order.order_number}>
                              {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <IconChevronDown size={14} />
                          </div>
                        </td>
                        <td className="adm-actions-cell" onClick={(event) => event.stopPropagation()}>
                          <a className="adm-icon-btn" href={'tel:' + order.phone} aria-label={'Call ' + order.customer_name} title="Call">
                            <IconPhone size={16} />
                          </a>
                          <a className="adm-icon-btn adm-icon-wa" href={whatsappLink(order)} target="_blank" rel="noreferrer" aria-label={'WhatsApp ' + order.customer_name} title="WhatsApp">
                            <IconWhatsApp size={16} />
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <footer className="adm-pager">
              <span>
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div>
                <button className="adm-icon-btn" onClick={() => setPage(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page">
                  <IconChevronLeft size={17} />
                </button>
                <span className="adm-pager-page">
                  {currentPage} / {pageCount}
                </span>
                <button className="adm-icon-btn" onClick={() => setPage(currentPage + 1)} disabled={currentPage >= pageCount} aria-label="Next page">
                  <IconChevronRight size={17} />
                </button>
              </div>
            </footer>
          </>
        )}
      </section>

      {selected && <OrderDrawer order={selected} onClose={closeDrawer} onStatus={(order, status) => void changeStatus(order, status)} />}

      {toast && (
        <div className={'adm-toast' + (toast.tone === 'error' ? ' is-error' : '')} role="status" aria-live="polite">
          {toast.tone === 'error' ? <IconAlert size={17} /> : <IconCheckCircle size={17} />}
          {toast.text}
        </div>
      )}
    </AdminShell>
  )
}
