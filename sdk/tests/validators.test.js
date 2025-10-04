import { validateConfig, validateAmount, validateOrderId, validateEmail, validateOtp } from '../src/utils/validators.js'

describe('Validators', () => {
  describe('validateConfig', () => {
    it('should validate valid config', () => {
      const config = {
        publishableKey: 'pk_test_123',
        merchantId: 'merchant_123'
      }
      const result = validateConfig(config)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject missing publishableKey', () => {
      const config = { merchantId: 'merchant_123' }
      const result = validateConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('publishableKey is required')
    })

    it('should reject invalid publishableKey format', () => {
      const config = {
        publishableKey: 'invalid_key',
        merchantId: 'merchant_123'
      }
      const result = validateConfig(config)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('publishableKey must start with "pk_"')
    })
  })

  describe('validateAmount', () => {
    it('should validate positive numbers', () => {
      expect(validateAmount(100)).toBe(true)
      expect(validateAmount('100')).toBe(true)
      expect(validateAmount(0.01)).toBe(true)
    })

    it('should reject invalid amounts', () => {
      expect(validateAmount(0)).toBe(false)
      expect(validateAmount(-100)).toBe(false)
      expect(validateAmount('invalid')).toBe(false)
      expect(validateAmount(null)).toBe(false)
    })
  })

  describe('validateOrderId', () => {
    it('should validate valid order IDs', () => {
      expect(validateOrderId('order_123')).toBe(true)
      expect(validateOrderId('ORDER-456')).toBe(true)
      expect(validateOrderId('ord_789_test')).toBe(true)
    })

    it('should reject invalid order IDs', () => {
      expect(validateOrderId('')).toBe(false)
      expect(validateOrderId('ab')).toBe(false) // too short
      expect(validateOrderId('order with spaces')).toBe(false)
      expect(validateOrderId('order@symbol')).toBe(false)
    })
  })

  describe('validateEmail', () => {
    it('should validate valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
    })
  })

  describe('validateOtp', () => {
    it('should validate 6-digit OTP', () => {
      expect(validateOtp('123456')).toBe(true)
      expect(validateOtp('000000')).toBe(true)
    })

    it('should reject invalid OTP', () => {
      expect(validateOtp('12345')).toBe(false) // too short
      expect(validateOtp('1234567')).toBe(false) // too long
      expect(validateOtp('12345a')).toBe(false) // non-numeric
      expect(validateOtp('')).toBe(false)
    })
  })
})