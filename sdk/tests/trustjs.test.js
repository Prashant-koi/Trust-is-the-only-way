import TrustJS from '../src/core/TrustJS.js'

// Mock API client
jest.mock('../src/core/ApiClient.js', () => {
  return jest.fn().mockImplementation(() => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }))
})

describe('TrustJS Core', () => {
  let trustjs

  beforeEach(() => {
    trustjs = new TrustJS({
      publishableKey: 'pk_test_123',
      merchantId: 'test_merchant'
    })
  })

  afterEach(() => {
    trustjs.destroy()
  })

  describe('initialization', () => {
    it('should initialize with valid config', () => {
      expect(trustjs).toBeDefined()
      expect(trustjs.getVersion()).toBe('1.0.0')
    })

    it('should throw error with invalid config', () => {
      expect(() => {
        new TrustJS({ publishableKey: 'invalid' })
      }).toThrow()
    })
  })

  describe('createPayment', () => {
    it('should create payment with valid options', async () => {
      const mockPayment = {
        id: 'pi_test_123',
        clientSecret: 'pi_test_123_secret',
        amount: 100,
        currency: 'usd',
        mfaRequired: false,
        status: 'requires_confirmation'
      }

      trustjs.apiClient.post.mockResolvedValue({ data: mockPayment })

      const result = await trustjs.createPayment({
        amount: 100,
        orderId: 'order_123'
      })

      expect(result).toEqual(mockPayment)
      expect(trustjs.apiClient.post).toHaveBeenCalledWith('/payments', {
        amount: 100,
        orderId: 'order_123',
        currency: 'usd',
        merchantId: 'test_merchant'
      })
    })

    it('should reject payment with invalid amount', async () => {
      await expect(trustjs.createPayment({
        amount: -100,
        orderId: 'order_123'
      })).rejects.toThrow('Invalid amount')
    })
  })

  describe('verifyMfa', () => {
    it('should verify MFA with valid OTP', async () => {
      const mockVerification = {
        success: true,
        mfaReceipt: 'mfa_receipt_123'
      }

      trustjs.apiClient.post.mockResolvedValue({ data: mockVerification })

      const result = await trustjs.verifyMfa('order_123', '123456')

      expect(result).toEqual(mockVerification)
      expect(trustjs.apiClient.post).toHaveBeenCalledWith('/mfa/verify', {
        orderId: 'order_123',
        otp: '123456'
      })
    })

    it('should reject invalid OTP', async () => {
      await expect(trustjs.verifyMfa('order_123', '12345')).rejects.toThrow('Invalid OTP format')
    })
  })

  describe('event system', () => {
    it('should register and emit events', () => {
      const mockCallback = jest.fn()
      
      const unsubscribe = trustjs.on('test:event', mockCallback)
      trustjs.emit('test:event', { data: 'test' })

      expect(mockCallback).toHaveBeenCalledWith({ data: 'test' })

      unsubscribe()
      trustjs.emit('test:event', { data: 'test2' })
      
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })
})