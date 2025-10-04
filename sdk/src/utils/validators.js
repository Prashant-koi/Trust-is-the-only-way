import { TRUSTJS_VERSION } from './constants.js'

export function validateConfig(config) {
  const errors = []

  if (!config) {
    return { valid: false, errors: ['Configuration object is required'] }
  }

  if (!config.publishableKey) {
    errors.push('publishableKey is required')
  } else if (!config.publishableKey.startsWith('pk_')) {
    errors.push('publishableKey must start with "pk_"')
  }

  if (!config.merchantId) {
    errors.push('merchantId is required')
  } else if (typeof config.merchantId !== 'string' || config.merchantId.length < 3) {
    errors.push('merchantId must be a string with at least 3 characters')
  }

  if (config.apiUrl && !isValidUrl(config.apiUrl)) {
    errors.push('apiUrl must be a valid URL')
  }

  if (config.mfaThreshold && (!isNumber(config.mfaThreshold) || config.mfaThreshold < 0)) {
    errors.push('mfaThreshold must be a positive number')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateAmount(amount) {
  if (!amount) return false
  
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && num <= 999999.99
}

export function validateOrderId(orderId) {
  if (!orderId) return false
  if (typeof orderId !== 'string') return false
  if (orderId.length < 3 || orderId.length > 100) return false
  
  // Allow alphanumeric, dashes, underscores
  return /^[a-zA-Z0-9_-]+$/.test(orderId)
}

export function validateEmail(email) {
  if (!email) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateOtp(otp) {
  if (!otp) return false
  if (typeof otp !== 'string') return false
  if (otp.length !== 6) return false
  
  return /^\d{6}$/.test(otp)
}

export function validateCurrency(currency) {
  const validCurrencies = ['usd', 'eur', 'gbp', 'jpy', 'cad', 'aud']
  return validCurrencies.includes(currency?.toLowerCase())
}

// Helper functions
function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value)
}