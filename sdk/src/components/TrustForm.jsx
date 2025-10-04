import React, { useState, useEffect, useRef } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useTrustJSContext } from './TrustJSProvider.jsx'
import { formatAmount, formatOtp, formatOrderId } from '../utils/formatters.js'
import { validateEmail, validateOtp } from '../utils/validators.js'

export function TrustForm({
  amount,
  orderId,
  currency = 'usd',
  customer = {},
  onSuccess,
  onError,
  onMfaRequired,
  onCancel,
  showCancel = false,
  theme = 'dark'
}) {
  const stripe = useStripe()
  const elements = useElements()
  const trustjs = useTrustJSContext()
  
  const [step, setStep] = useState('card') // 'card' | 'mfa'
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('')
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState(customer.email || '')
  const [paymentData, setPaymentData] = useState(null)
  const [mfaAttempts, setMfaAttempts] = useState(0)
  
  const otpInputRef = useRef(null)

  // Auto-focus OTP input
  useEffect(() => {
    if (step === 'mfa' && otpInputRef.current) {
      setTimeout(() => otpInputRef.current.focus(), 100)
    }
  }, [step])

  // Auto-fill email from customer prop
  useEffect(() => {
    if (customer.email && !email) {
      setEmail(customer.email)
    }
  }, [customer.email])

  const handleCardSubmit = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      setStatus('Payment system not ready. Please refresh and try again.')
      return
    }

    setIsProcessing(true)
    setStatus('Processing payment...')

    try {
      // Step 1: Create payment intent
      const paymentIntent = await trustjs.createPayment({
        amount,
        orderId,
        currency,
        customer: { ...customer, email }
      })

      console.log('🔍 TrustForm: Payment intent created', paymentIntent)

      const cardElement = elements.getElement(CardElement)
      
      // Step 2: Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: email || customer.email,
          name: customer.name,
        },
      })

      if (error) {
        throw error
      }

      console.log('🔍 TrustForm: Payment method created', paymentMethod.id)

      // Store payment data for potential MFA step
      setPaymentData({
        paymentIntent,
        paymentMethod,
        clientSecret: paymentIntent.clientSecret
      })

      if (paymentIntent.mfaRequired) {
        setStatus('MFA verification required. Sending OTP...')
        
        // Send OTP with amount
        await trustjs.mfaManager.sendOtp(orderId, amount)
        
        setStep('mfa')
        setStatus('✅ OTP sent! Check your backend terminal for the code.')
        onMfaRequired?.(paymentIntent)
      } else {
        // Complete payment directly
        setStatus('Confirming payment...')
        const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
          payment_method: paymentMethod.id
        })

        if (result.error) {
          throw result.error
        }

        setStatus('🎉 Payment successful!')
        onSuccess?.(result.paymentIntent)
      }
    } catch (error) {
      console.error('TrustForm: Card payment error', error)
      setStatus(`❌ Payment failed: ${error.message}`)
      onError?.(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMfaSubmit = async (event) => {
    event.preventDefault()
    
    if (!validateOtp(otp)) {
      setStatus('Please enter a valid 6-digit OTP')
      return
    }

    setIsProcessing(true)
    setStatus('Verifying MFA...')

    try {
      // Verify OTP
      console.log('🔍 TrustForm: Verifying OTP', { orderId, otp })
      const verification = await trustjs.verifyMfa(orderId, otp)
      
      if (!verification.success) {
        throw new Error(verification.message || 'MFA verification failed')
      }

      setStatus('✅ MFA verified! Completing payment...')

      // Complete payment
      const result = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: paymentData.paymentMethod.id
      })

      if (result.error) {
        throw result.error
      }

      setStatus('🎉 Payment successful!')
      onSuccess?.(result.paymentIntent)
      
    } catch (error) {
      console.error('TrustForm: MFA verification error', error)
      setMfaAttempts(prev => prev + 1)
      
      if (mfaAttempts >= 2) {
        setStatus('❌ Too many failed attempts. Please start over.')
        setTimeout(() => {
          setStep('card')
          setOtp('')
          setMfaAttempts(0)
        }, 3000)
      } else {
        setStatus(`❌ OTP verification failed: ${error.message}`)
      }
      
      onError?.(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResendOtp = async () => {
    if (isProcessing) return

    setIsProcessing(true)
    setStatus('Resending OTP...')
    setOtp('')

    try {
      await trustjs.mfaManager.sendOtp(orderId, amount)
      setStatus('✅ New OTP sent! Check your backend terminal.')
    } catch (error) {
      setStatus(`❌ Failed to resend OTP: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOtpChange = (e) => {
    const formatted = formatOtp(e.target.value)
    setOtp(formatted)
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: theme === 'dark' ? '#f8f9ff' : '#424770',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: theme === 'dark' ? 'rgba(248, 249, 255, 0.5)' : '#aab7c4',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
      complete: {
        color: '#10b981',
        iconColor: '#10b981',
      },
    },
  }

  return (
    <div className={`trustjs-form ${theme === 'dark' ? 'trustjs-form--dark' : 'trustjs-form--light'}`}>
      <div className="trustjs-form__header">
        <h3>🔒 Secure Payment</h3>
        <p>Order: {formatOrderId(orderId)} • Amount: {formatAmount(amount, currency)}</p>
      </div>

      {step === 'card' ? (
        <form onSubmit={handleCardSubmit} className="trustjs-form__card">
          <div className="trustjs-form__field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="trustjs-form__input"
              required
            />
            {email && !validateEmail(email) && (
              <span className="trustjs-form__error">Please enter a valid email address</span>
            )}
          </div>

          <div className="trustjs-form__field">
            <label>Card Information</label>
            <div className="trustjs-form__card-element">
              <CardElement 
                options={cardElementOptions}
                onChange={(event) => {
                  if (event.error) {
                    setStatus(`Card error: ${event.error.message}`)
                  } else if (event.complete) {
                    setStatus('')
                  }
                }}
              />
            </div>
            <p className="trustjs-form__hint">
              🔒 Your payment information is encrypted and secure
            </p>
          </div>

          <div className="trustjs-form__actions">
            <button
              type="submit"
              disabled={!stripe || isProcessing || !email || !validateEmail(email)}
              className="trustjs-form__submit"
            >
              {isProcessing ? (
                <>
                  <span className="trustjs-spinner" />
                  Processing...
                </>
              ) : (
                `🔒 Pay ${formatAmount(amount, currency)}`
              )}
            </button>
            
            {showCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="trustjs-form__cancel"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Test Card Info */}
          <div className="trustjs-form__test-info">
            <p className="trustjs-form__test-title">💳 Test Mode - Use these card numbers:</p>
            <p>• 4242 4242 4242 4242 (Visa)</p>
            <p>• 5555 5555 5555 4444 (Mastercard)</p>
            <p>• Any future date • Any 3-digit CVC</p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit} className="trustjs-form__mfa">
          <div className="trustjs-form__mfa-notice">
            <span>⚠️</span>
            <div>
              <strong>MFA Verification Required</strong>
              <p>Please enter the 6-digit code from your backend terminal.</p>
              <p className="trustjs-form__mfa-hint">
                💡 The OTP is displayed in your backend terminal console
              </p>
            </div>
          </div>

          <div className="trustjs-form__field">
            <label htmlFor="otp">Enter OTP Code:</label>
            <input
              ref={otpInputRef}
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={handleOtpChange}
              onPaste={(e) => {
                e.preventDefault()
                const pasteData = e.clipboardData.getData('text')
                const formatted = formatOtp(pasteData)
                setOtp(formatted)
              }}
              placeholder="123456"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
              className="trustjs-form__otp"
            />
            <div className="trustjs-form__otp-progress">
              {otp.length}/6 digits entered
            </div>
          </div>

          <div className="trustjs-form__actions">
            <button
              type="submit"
              disabled={isProcessing || otp.length !== 6}
              className="trustjs-form__submit"
            >
              {isProcessing ? (
                <>
                  <span className="trustjs-spinner" />
                  Verifying...
                </>
              ) : (
                `✅ Verify & Pay (${otp.length}/6)`
              )}
            </button>
            
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isProcessing}
              className="trustjs-form__secondary"
            >
              🔄 Resend OTP
            </button>
            
            <button
              type="button"
              onClick={() => {
                setStep('card')
                setOtp('')
                setMfaAttempts(0)
              }}
              disabled={isProcessing}
              className="trustjs-form__cancel"
            >
              ← Back to Card
            </button>
          </div>

          {/* Debug info for development */}
          {otp && (
            <div className="trustjs-form__debug">
              <p>✅ Entered: {otp} ({otp.length}/6 digits)</p>
              {mfaAttempts > 0 && (
                <p>⚠️ Failed attempts: {mfaAttempts}/3</p>
              )}
            </div>
          )}
        </form>
      )}

      {status && (
        <div className={`trustjs-form__status ${
          status.includes('successful') || status.includes('✅') || status.includes('🎉')
            ? 'trustjs-form__status--success' 
            : status.includes('failed') || status.includes('❌')
            ? 'trustjs-form__status--error'
            : 'trustjs-form__status--info'
        }`}>
          {status}
        </div>
      )}
    </div>
  )
}

export default TrustForm