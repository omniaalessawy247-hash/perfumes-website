export const normalizePhone = (value: string): string =>
  value.trim().replace(/[\s-]/g, '').replace(/^\+?20/, '0')

export const isValidEgyptianPhone = (value: string): boolean => /^01[0125]\d{8}$/.test(normalizePhone(value))

export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
