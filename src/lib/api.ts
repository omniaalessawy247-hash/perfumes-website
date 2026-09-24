import { supabase } from './supabase'
import type { Size } from '../data/catalog'

export interface OrderCustomer {
  name: string
  phone: string
  address: string
  city: string
  payment: 'cod'
}

export interface OrderLine {
  product_id: string
  size_ml: number
  quantity: number
  engraving: string
  gift_wrap: boolean
}

export interface OrderResult {
  id: string
  order_number: string
  total_egp: number
}

const RATE_LIMIT_MESSAGE = 'Too many attempts. Please try again later.'
const CHECKOUT_FAILURE_MESSAGE = 'We could not place your order. Please check your details and try again.'
const TRACK_FAILURE_MESSAGE =
  "We couldn't find an order with these details. Please check your order number and phone number."

const TIMEOUT_MESSAGE = 'This is taking longer than usual. Please check your connection and try again.'

// Reject stalled requests so the UI never spins forever
function withTimeout<T>(request: PromiseLike<T>, ms = 20000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(TIMEOUT_MESSAGE)), ms)
    Promise.resolve(request).then(
      (value) => {
        window.clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        window.clearTimeout(timer)
        reject(error)
      },
    )
  })
}

const ORDER_ERRORS: Record<string, string> = {
  'invalid phone': 'Please enter a valid phone number.',
  'invalid name': 'Please enter your full name.',
  'invalid address': 'Please enter your full address.',
  'invalid item': 'An item in your bag is unavailable. Please refresh and try again.',
}

function orderFailure(error: { message: string; code?: string }): string {
  const message = error.message.toLowerCase()
  if (message.includes('too many attempts')) return RATE_LIMIT_MESSAGE
  const known = Object.entries(ORDER_ERRORS).find(([key]) => message.includes(key))
  if (known) return known[1]
  console.error('create_order failed', error)
  return CHECKOUT_FAILURE_MESSAGE + (error.code ? ' (' + error.code + ')' : '')
}

function isRateLimited(message: string): boolean {
  return message.toLowerCase().includes('too many attempts')
}

export async function fetchSizes(): Promise<Record<string, Size[]>> {
  const { data, error } = await supabase
    .from('product_sizes')
    .select('product_id, size_ml, price_egp, in_stock')
    .order('size_ml')

  if (error) throw error

  const grouped: Record<string, Size[]> = {}
  for (const row of data ?? []) {
    if (!row.in_stock) continue
    const list = grouped[row.product_id] ?? []
    list.push({ ml: row.size_ml, price: Number(row.price_egp) })
    grouped[row.product_id] = list
  }
  return grouped
}

// Honeypot must stay empty; the RPC rejects filled values
export async function submitOrder(
  customer: OrderCustomer,
  lines: OrderLine[],
  honeypot: string,
): Promise<OrderResult> {
  const { data, error } = await withTimeout(supabase.rpc('create_order', {
    p_name: customer.name,
    p_phone: customer.phone,
    p_address: customer.address,
    p_city: customer.city,
    p_payment: customer.payment,
    p_items: lines,
    p_honeypot: honeypot,
  }))

  if (error) throw new Error(orderFailure(error))
  return data as OrderResult
}

export interface TrackedOrderItem {
  product_id: string
  size_ml: number
  quantity: number
  unit_price: number
}

export interface TrackedOrder {
  order_number: string
  status: string
  total_egp: number
  created_at: string
  items: TrackedOrderItem[]
}

// Matched server-side in track_order(), never in the browser
export async function trackOrder(orderNumber: string, phone: string): Promise<TrackedOrder | null> {
  const { data, error } = await withTimeout(
    supabase.rpc('track_order', {
      p_order_number: orderNumber,
      p_phone: phone,
    }),
  )

  if (error) throw new Error(isRateLimited(error.message) ? RATE_LIMIT_MESSAGE : TRACK_FAILURE_MESSAGE)
  return (data as TrackedOrder | null) ?? null
}

// --- Admin -----------------------------------------------------------

export async function adminSignIn(email: string, password: string): Promise<void> {
  const { error: guardError } = await supabase.rpc('admin_login_guard', { p_email: email })
  if (guardError) throw new Error(RATE_LIMIT_MESSAGE)

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Invalid email or password.')
}

export async function adminSignOut(): Promise<void> {
  await supabase.auth.signOut()
}

export interface AdminOrderItem {
  product_id: string
  size_ml: number
  quantity: number
  unit_price: number
  engraving: string | null
  gift_wrap: boolean
}

export interface AdminOrder {
  id: string
  order_number: string
  customer_name: string
  phone: string
  address: string
  city: string
  status: string
  total_egp: number
  created_at: string
  order_items: AdminOrderItem[]
}

// Rows are limited to admins by RLS (phase2.sql)
export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      'id, order_number, customer_name, phone, address, city, status, total_egp, created_at,' +
        'order_items(product_id, size_ml, quantity, unit_price, engraving, gift_wrap)',
    )
    .order('created_at', { ascending: false })

  if (error) throw new Error('Could not load orders.')
  return (data ?? []) as unknown as AdminOrder[]
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw new Error('Could not update this order.')
}
