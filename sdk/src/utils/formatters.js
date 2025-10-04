export function formatAmount(amount, currency = 'USD') {
  const num = parseFloat(amount)
  if (isNaN(num)) return '0.00'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

export function formatOrderId(orderId) {
  if (!orderId) return ''
  return orderId.toString().toUpperCase()
}

export function formatOtp(otp) {
  if (!otp) return ''
  return otp.replace(/\D/g, '').slice(0, 6)
}

export function formatCardNumber(cardNumber) {
  if (!cardNumber) return ''
  
  // Remove all non-digits
  const cleaned = cardNumber.replace(/\D/g, '')
  
  // Add spaces every 4 digits
  return cleaned.replace(/(.{4})/g, '$1 ').trim()
}

export function formatExpiryDate(expiry) {
  if (!expiry) return ''
  
  // Remove all non-digits
  const cleaned = expiry.replace(/\D/g, '')
  
  // Format as MM/YY
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + (cleaned.length > 2 ? '/' + cleaned.slice(2, 4) : '')
  }
  
  return cleaned
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatPercentage(value, decimals = 2) {
  const num = parseFloat(value)
  if (isNaN(num)) return '0%'
  
  return (num * 100).toFixed(decimals) + '%'
}

export function sanitizeHtml(html) {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}