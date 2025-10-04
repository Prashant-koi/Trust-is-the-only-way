import { useState, useEffect, useRef } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

// Use the actual publishable key from your .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SEPdMHqjaPgoLNariaByJzqugHs05citHWNSmTx2z5Zkn9oH85qD1KYXRMubgt3PYa0q43hIZ0OAbLXmcoxMZWO00cd448f5V')

function PaymentForm({ orderId, amount, onPaymentSuccess, onPaymentError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [showMfa, setShowMfa] = useState(false)
  const [otp, setOtp] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [email, setEmail] = useState('')
  const [linkAuthenticated, setLinkAuthenticated] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  
  // Add ref for OTP input to ensure it can be focused
  const otpInputRef = useRef(null)

  // Check if Stripe loaded properly
  useEffect(() => {
    if (!stripe) {
      setPaymentStatus('Loading payment system...')
    } else {
      setPaymentStatus('')
    }
  }, [stripe])

  // Auto-focus OTP input when MFA form shows
  useEffect(() => {
    if (showMfa && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current.focus()
      }, 100)
    }
  }, [showMfa])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setPaymentStatus('Payment system not ready. Please refresh and try again.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setPaymentStatus('Card input not found. Please refresh and try again.')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('Processing payment...')

    try {
      // Step 1: Create Payment Intent
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: 'default',
          orderId,
          amount,
          currency: 'usd'
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log('🔍 Payment Intent Response:', data) // Debug log
      
      const { clientSecret: cs, mfaRequired: mfaReq, paymentIntentId: piId } = data
      
      setPaymentIntentId(piId)
      setClientSecret(cs)

      if (mfaReq) {
        // Step 2a: MFA Required - Create payment method and store it, then send OTP
        setPaymentStatus('Setting up payment method...')
        
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            email: email || undefined,
          },
        })

        if (error) {
          throw error
        }

        setPaymentMethodId(paymentMethod.id)
        console.log('🔍 Payment Method Created:', paymentMethod.id) // Debug log
        
        // Send OTP request to backend
        setPaymentStatus('Sending OTP to your device...')
        await sendOtpRequest()
        
      } else {
        // Step 2b: No MFA Required - Process payment directly
        setPaymentStatus('Confirming payment...')
        const result = await stripe.confirmCardPayment(cs, {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: email || undefined,
            },
          }
        })

        if (result.error) {
          throw result.error
        }

        setPaymentStatus('Payment successful!')
        onPaymentSuccess(result.paymentIntent)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus(`Payment failed: ${error.message}`)
      onPaymentError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Send OTP request to backend
  const sendOtpRequest = async () => {
    try {
      setPaymentStatus('Sending OTP...')
      console.log('🔍 Sending OTP request for order:', orderId) // Debug log
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          merchantId: 'default'
        }),
      })

      console.log('🔍 OTP Response Status:', response.status) // Debug log

      if (!response.ok) {
        const errorText = await response.text()
        console.error('🔍 OTP Error Response:', errorText)
        throw new Error(`Failed to send OTP: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('🔍 OTP Response Data:', result) // Debug log

      if (result.success) {
        setOtpSent(true)
        setShowMfa(true)
        setPaymentStatus('✅ OTP sent! Check your backend terminal for the code.')
        console.log('🔍 CHECK YOUR BACKEND TERMINAL FOR OTP!')
      } else {
        throw new Error(result.message || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('OTP send error:', error)
      setPaymentStatus(`Failed to send OTP: ${error.message}`)
      throw error
    }
  }

  const handleMfaSubmit = async (event) => {
    event.preventDefault()
    
    if (otp.length !== 6) {
      setPaymentStatus('Please enter a valid 6-digit OTP')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('Verifying MFA...')

    try {
      console.log('🔍 Verifying OTP:', {
        orderId,
        otp,
        merchantId: 'default'
      }) // Debug log

      // **FIXED: Use /api/verify-otp instead of /api/verify-mfa**
      const mfaResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: 'default',
          orderId,
          otp
        }),
      })

      console.log('🔍 OTP Verification Response Status:', mfaResponse.status) // Debug log

      if (!mfaResponse.ok) {
        const errorText = await mfaResponse.text()
        console.error('🔍 OTP Verification Error Response:', errorText)
        throw new Error(`OTP verification failed: ${mfaResponse.status} - ${errorText}`)
      }

      const { success, message, mfaReceipt } = await mfaResponse.json()
      console.log('🔍 OTP Verification Response Data:', { success, message, mfaReceipt }) // Debug log

      if (!success) {
        throw new Error(message || 'OTP verification failed')
      }

      setPaymentStatus('✅ OTP verified! Completing payment...')

      // **Step 4: Complete payment after successful OTP verification**
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId
      })

      if (result.error) {
        throw result.error
      }

      setPaymentStatus('🎉 Payment successful!')
      onPaymentSuccess(result.paymentIntent)
      
    } catch (error) {
      console.error('OTP verification error:', error)
      setPaymentStatus(`❌ OTP verification failed: ${error.message}`)
      onPaymentError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Fixed OTP input handler
  const handleOtpChange = (e) => {
    const value = e.target.value
    // Allow only digits and limit to 6 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setOtp(numericValue)
    console.log('🔍 OTP Input Changed:', numericValue) // Debug log
  }

  // Resend OTP if needed
  const handleResendOtp = async () => {
    try {
      setOtp('') // Clear current OTP
      await sendOtpRequest()
    } catch (error) {
      // Error already handled in sendOtpRequest
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#f8f9ff',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: 'rgba(248, 249, 255, 0.5)',
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
    hidePostalCode: false,
  }

  if (!stripe) {
    return (
      <div className="glass-panel max-w-md mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-theme-text/60">Loading secure payment system...</p>
      </div>
    )
  }

  return (
    <div className="glass-panel max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-theme-text flex items-center gap-2 mb-2">
          💳 Secure Payment
        </h3>
        <p className="text-theme-text/60 text-sm">
          Order: {orderId} • Amount: ${amount}
        </p>
      </div>

      <div className="space-y-6">
        {!showMfa ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email for Link */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>

            {/* Card Information */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-3">
                Card Information
              </label>
              <div className="p-4 bg-white/8 border-2 border-white/15 rounded-lg focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/20 transition-all min-h-[50px]">
                <CardElement 
                  options={cardElementOptions}
                  onReady={() => {
                    console.log('CardElement ready')
                  }}
                  onChange={(event) => {
                    if (event.error) {
                      setPaymentStatus(`Card error: ${event.error.message}`)
                    } else if (event.complete) {
                      setPaymentStatus('')
                    }
                  }}
                />
              </div>
              <p className="text-xs text-theme-text/50 mt-2 flex items-center gap-1">
                🔒 Your payment information is encrypted and secure
              </p>
            </div>
            
            <button 
              type="submit" 
              disabled={!stripe || isProcessing || !elements}
              className="primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  🔒 Pay ${amount}
                </>
              )}
            </button>

            {/* Test Card Info */}
            <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3">
              <p className="text-xs text-blue-400 font-medium mb-1">💳 Test Mode - Use these card numbers:</p>
              <p className="text-xs text-theme-text/70">• 4242 4242 4242 4242 (Visa)</p>
              <p className="text-xs text-theme-text/70">• 5555 5555 5555 4444 (Mastercard)</p>
              <p className="text-xs text-theme-text/70">• Any future date • Any 3-digit CVC</p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">⚠️</span>
                <span className="font-medium text-theme-text">MFA Verification Required</span>
              </div>
              <p className="text-sm text-theme-text/70">
                Please enter the 6-digit code from your backend terminal.
              </p>
              <p className="text-xs text-cyan-400 mt-2">
                💡 The OTP is displayed in your backend terminal console
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-text mb-2">
                Enter OTP Code:
              </label>
              <input
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp}
                onChange={handleOtpChange}
                onPaste={(e) => {
                  e.preventDefault()
                  const pasteData = e.clipboardData.getData('text')
                  const numericValue = pasteData.replace(/\D/g, '').slice(0, 6)
                  setOtp(numericValue)
                  console.log('🔍 OTP Pasted:', numericValue)
                }}
                placeholder="123456"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                className="w-full px-4 py-4 bg-white/8 border-2 border-white/15 rounded-lg text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-center text-xl tracking-[0.5em] font-mono transition-all"
                style={{
                  caretColor: '#6c63ff',
                  letterSpacing: '0.5em'
                }}
              />
              <p className="text-xs text-theme-text/50 mt-2 text-center">
                Click in the box above and type your 6-digit code
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isProcessing || otp.length !== 6}
                className="primary flex-1 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    ✅ Verify & Pay ({otp.length}/6)
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={handleResendOtp}
                disabled={isProcessing}
                className="glass-button py-3 px-4 text-sm"
              >
                🔄 Resend OTP
              </button>
            </div>

            {/* Debug info */}
            {otp && (
              <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-2">
                <p className="text-xs text-green-400">
                  ✅ Entered: {otp} ({otp.length}/6 digits)
                </p>
              </div>
            )}
          </form>
        )}

        {paymentStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            paymentStatus.includes('successful') || paymentStatus.includes('✅') || paymentStatus.includes('🎉')
              ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
              : paymentStatus.includes('failed') || paymentStatus.includes('error') || paymentStatus.includes('❌')
              ? 'bg-red-400/20 text-red-400 border border-red-400/30'
              : 'bg-blue-400/20 text-blue-400 border border-blue-400/30'
          }`}>
            {paymentStatus}
          </div>
        )}
      </div>
    </div>
  )
}

function StripePaymentForm({ orderId, amount, onPaymentSuccess, onPaymentError }) {
  // **FIXED STRIPE CONFIGURATION** - Removed invalid color values
  const options = {
    mode: 'payment',
    currency: 'usd',
    amount: Math.round(parseFloat(amount) * 100),
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#6c63ff',
        colorBackground: '#1a1a2e', // Fixed: Valid hex color instead of rgba
        colorText: '#f8f9ff',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={options}
      key={`${orderId}-${amount}`} // Force recreation with unique key
    >
      <PaymentForm 
        orderId={orderId}
        amount={amount}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  )
}

export default StripePaymentForm