import { findPerfume } from '../../data/catalog'
import type { AdminOrder } from '../../lib/api'
import { formatPrice } from '../../lib/format'

export const STATUSES = ['New', 'Confirmed', 'Delivered', 'Cancelled'] as const
export type OrderStatus = (typeof STATUSES)[number]

export const perfumeName = (id: string): string => findPerfume(id)?.name ?? id

// One signature colour per perfume, taken from the storefront themes.
const PERFUME_COLORS: Record<string, string> = {
  ambre: '#d9902f',
  ward: '#c9787c',
  'oud-nuit': '#7a2e2e',
  jasmin: '#7f9a62',
}
export const perfumeColor = (id: string): string => PERFUME_COLORS[id] ?? '#7a8560'

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatShort(value: string): string {
  const date = new Date(value)
  const day = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return day + ', ' + time
}

export function timeAgo(value: string): string {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return minutes + ' min ago'
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours + ' h ago'
  const days = Math.floor(hours / 24)
  return days + (days === 1 ? ' day ago' : ' days ago')
}

export function itemSummary(order: AdminOrder): string {
  return order.order_items
    .map((item) => perfumeName(item.product_id) + ' ' + item.size_ml + 'ml ×' + item.quantity)
    .join(', ')
}

export function whatsappLink(order: AdminOrder): string {
  const message =
    'Hi ' +
    order.customer_name +
    ', this is AMBRE confirming your order ' +
    order.order_number +
    ' (' +
    itemSummary(order) +
    ') for ' +
    formatPrice(order.total_egp) +
    '. We will deliver to ' +
    order.address +
    ', ' +
    order.city +
    '.'
  const phone = order.phone.replace(/\D/g, '').replace(/^0/, '20')
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message)
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = Array.from(parts[0])[0] ?? ''
  const second = parts.length > 1 ? (Array.from(parts[parts.length - 1])[0] ?? '') : ''
  return (first + second).toUpperCase()
}

const AVATAR_TINTS = ['#d9902f', '#c9787c', '#7a8560', '#7a2e2e', '#a8743a', '#5f6f4d']
export function avatarTint(name: string): string {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return AVATAR_TINTS[hash % AVATAR_TINTS.length]
}

// Prefix formula characters to block CSV injection
function csvCell(value: string | number): string {
  let text = String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text
  return '"' + text.replace(/"/g, '""') + '"'
}

export function downloadOrdersCsv(orders: AdminOrder[]): void {
  const header = ['Order #', 'Date', 'Customer', 'Phone', 'City', 'Address', 'Items', 'Total (EGP)', 'Status']
  const rows = orders.map((order) => [
    order.order_number,
    formatDate(order.created_at),
    order.customer_name,
    order.phone,
    order.city,
    order.address,
    itemSummary(order),
    order.total_egp,
    order.status,
  ])
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'ambre-orders-' + new Date().toISOString().slice(0, 10) + '.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
