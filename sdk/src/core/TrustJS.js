import { loadStripe } from '@stripe/stripe-js'
import PaymentManager from './PaymentManager.js'
import MfaManager from './MfaManager.js'
import ApiClient from './ApiClient.js'
import { TrustJSError, ValidationError } from '../utils/errors.js'
import { validateConfig, validateAmount, validateOrderId } from '../utils/validators.js'

export default class TrustJS {
  constructor(config) {
    // Validate configuration
    const validation = validateConfig(config)
    if (!validation.valid) {
      throw new ValidationError(`Invalid TrustJS configuration: ${validation.errors.join(', ')}`)
    }

    this.config = {
      apiUrl: 'https://api.trustjs.dev',
      environment: 'production',
      theme: 'dark',
      mfaThreshold: 500,
      enableBlockchain: true,
      enableAnalytics: true,
      timeout: 30000,
      retries: 3,
      ...config
    }

    // Initialize managers
    this.apiClient = new ApiClient(this.config)
    this.paymentManager = new PaymentManager(this.config, this.apiClient)
    this.mfaManager = new MfaManager(this.config, this.apiClient)
    
    // Initialize Stripe
    this.stripePromise = loadStripe(this.config.publishableKey)
    
    // Event listeners
    this.listeners = new Map()
    
    console.log('🔒 TrustJS initialized:', {
      version: this.getVersion(),
      environment: this.config.environment,
      merchantId: this.config.merchantId
    })
  }

  // Version info
  getVersion() {
    return '1.0.0'
  }

  // Event system
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`TrustJS event handler error for '${event}':`, error)
      }
    })
  }

  // Main payment method
  async createPayment(options) {
    try {
      // Validate options
      if (!validateAmount(options.amount)) {
        throw new ValidationError('Invalid amount')
      }
      if (!validateOrderId(options.orderId)) {
        throw new ValidationError('Invalid orderId')
      }

      this.emit('payment:started', { orderId: options.orderId })
      
      const result = await this.paymentManager.createPayment(options)
      
      this.emit('payment:created', result)
      return result
      
    } catch (error) {
      this.emit('payment:error', { error, orderId: options.orderId })
      throw error
    }
  }

  // MFA verification
  async verifyMfa(orderId, code) {
    try {
      this.emit('mfa:started', { orderId })
      
      const result = await this.mfaManager.verifyCode(orderId, code)
      
      this.emit('mfa:verified', { orderId, result })
      return result
      
    } catch (error) {
      this.emit('mfa:error', { error, orderId })
      throw error
    }
  }

  // Complete payment
  async confirmPayment(clientSecret, paymentMethodId) {
    try {
      const stripe = await this.stripePromise
      if (!stripe) {
        throw new TrustJSError('Stripe failed to load')
      }

      this.emit('payment:confirming', { clientSecret })
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId
      })

      if (result.error) {
        throw new TrustJSError(`Payment confirmation failed: ${result.error.message}`)
      }

      this.emit('payment:confirmed', result.paymentIntent)
      return result.paymentIntent
      
    } catch (error) {
      this.emit('payment:confirmation_error', { error, clientSecret })
      throw error
    }
  }

  // Analytics
  async getAnalytics(options = {}) {
    try {
      return await this.apiClient.get('/analytics', {
        timeRange: options.timeRange || '7d',
        merchantId: this.config.merchantId
      })
    } catch (error) {
      throw new TrustJSError(`Failed to fetch analytics: ${error.message}`)
    }
  }

  // Fraud detection
  async getFraudPatterns(options = {}) {
    try {
      return await this.apiClient.get('/fraud-patterns', {
        timeRange: options.timeRange || '24h',
        merchantId: this.config.merchantId
      })
    } catch (error) {
      throw new TrustJSError(`Failed to fetch fraud patterns: ${error.message}`)
    }
  }

  // Blockchain verification
  async verifyBlockchain(transactionHash) {
    try {
      return await this.apiClient.get(`/blockchain/verify/${transactionHash}`)
    } catch (error) {
      throw new TrustJSError(`Blockchain verification failed: ${error.message}`)
    }
  }

  // Configuration updates
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    this.apiClient.updateConfig(this.config)
    this.emit('config:updated', this.config)
  }

  // Cleanup
  destroy() {
    this.listeners.clear()
    this.apiClient.destroy()
    this.emit('destroyed')
  }
}