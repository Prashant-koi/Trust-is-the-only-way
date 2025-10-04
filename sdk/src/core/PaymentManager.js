import { TrustJSError } from '../utils/errors.js'
import { validateAmount, validateOrderId } from '../utils/validators.js'

export default class PaymentManager {
  constructor(config, apiClient) {
    this.config = config
    this.apiClient = apiClient
  }

  async createPayment(options) {
    const { amount, orderId, currency = 'usd', customer = {} } = options

    // Validate inputs
    if (!validateAmount(amount)) {
      throw new TrustJSError('Invalid amount provided')
    }
    if (!validateOrderId(orderId)) {
      throw new TrustJSError('Invalid orderId provided')
    }

    try {
      console.log('🔍 PaymentManager: Creating payment intent', { orderId, amount })

      const response = await this.apiClient.post('/create-payment-intent', {
        merchantId: this.config.merchantId,
        orderId,
        amount: parseFloat(amount),
        currency,
        customer,
        mfaThreshold: this.config.mfaThreshold
      })

      console.log('🔍 PaymentManager: Payment intent created', response)

      return {
        ...response,
        orderId,
        amount,
        currency,
        customer
      }
    } catch (error) {
      console.error('PaymentManager: Payment creation failed', error)
      throw new TrustJSError(`Payment creation failed: ${error.message}`)
    }
  }

  async getPaymentStatus(paymentIntentId) {
    try {
      return await this.apiClient.get(`/payment/${paymentIntentId}/status`)
    } catch (error) {
      throw new TrustJSError(`Failed to get payment status: ${error.message}`)
    }
  }

  async cancelPayment(paymentIntentId) {
    try {
      return await this.apiClient.post(`/payment/${paymentIntentId}/cancel`)
    } catch (error) {
      throw new TrustJSError(`Failed to cancel payment: ${error.message}`)
    }
  }
}