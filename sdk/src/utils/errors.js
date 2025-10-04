export class TrustJSError extends Error {
  constructor(message, code = null, details = null) {
    super(message)
    this.name = 'TrustJSError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TrustJSError)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    }
  }
}

export class ValidationError extends TrustJSError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR', { field })
    this.name = 'ValidationError'
  }
}

export class PaymentError extends TrustJSError {
  constructor(message, paymentIntentId = null) {
    super(message, 'PAYMENT_ERROR', { paymentIntentId })
    this.name = 'PaymentError'
  }
}

export class MfaError extends TrustJSError {
  constructor(message, orderId = null) {
    super(message, 'MFA_ERROR', { orderId })
    this.name = 'MfaError'
  }
}

export class NetworkError extends TrustJSError {
  constructor(message, endpoint = null, status = null) {
    super(message, 'NETWORK_ERROR', { endpoint, status })
    this.name = 'NetworkError'
  }
}

export class ConfigurationError extends TrustJSError {
  constructor(message, configKey = null) {
    super(message, 'CONFIGURATION_ERROR', { configKey })
    this.name = 'ConfigurationError'
  }
}