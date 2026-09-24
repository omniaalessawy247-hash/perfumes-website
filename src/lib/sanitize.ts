// Strip tags and control characters before saving
export function sanitizeText(value: string, maxLength = 200): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength)
}
