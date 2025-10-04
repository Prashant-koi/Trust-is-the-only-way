import { TrustJSError } from '../utils/errors.js'

export default class MfaManager {
  constructor(config, apiClient) {
    this.config = config
    this.apiClient = apiClient
    this.otpCache = new Map()
  }

  async sendOtp(orderId, amount = 0) {
    try {
      console.log('🔍 MfaManager: Sending OTP for order', orderId)

      const response = await this.apiClient.post('/send-otp', {
        merchantId: this.config.merchantId,
        orderId,
        amount,
        method: 'terminal' // For development, shows in terminal
      })

      if (response.success) {
        console.log('🔍 MfaManager: OTP sent successfully')
        return response
      } else {
        throw new TrustJSError(response.message || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('MfaManager: OTP send failed', error)
      throw new TrustJSError(`OTP send failed: ${error.message}`)
    }
  }

  async verifyCode(orderId, code) {
    if (!code || code.length !== 6) {
      throw new TrustJSError('Invalid OTP code format')
    }

    try {
      console.log('🔍 MfaManager: Verifying OTP', { orderId, code })

      const response = await this.apiClient.post('/verify-otp', {
        merchantId: this.config.merchantId,
        orderId,
        otp: code
      })

      console.log('🔍 MfaManager: OTP verification response', response)

      if (response.success) {
        // Cache successful verification
        this.otpCache.set(orderId, {
          verified: true,
          timestamp: Date.now(),
          mfaReceipt: response.mfaReceipt
        })
        return response
      } else {
        throw new TrustJSError(response.message || 'OTP verification failed')
      }
    } catch (error) {
      console.error('MfaManager: OTP verification failed', error)
      throw new TrustJSError(`OTP verification failed: ${error.message}`)
    }
  }

  isVerified(orderId) {
    const cached = this.otpCache.get(orderId)
    if (!cached) return false

    // Check if verification is still valid (5 minutes)
    const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000
    if (isExpired) {
      this.otpCache.delete(orderId)
      return false
    }

    return cached.verified
  }

  clearCache(orderId) {
    if (orderId) {
      this.otpCache.delete(orderId)
    } else {
      this.otpCache.clear()
    }
  }
}