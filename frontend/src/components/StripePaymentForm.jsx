import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function PaymentForm({ orderId, amount, onPaymentSuccess, onPaymentError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [mfaRequired, setMfaRequired] = useState(false)
  const [paymentIntentId, setPaymentIntentId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [otp, setOtp] = useState('')
  const [showMfa, setShowMfa] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setPaymentStatus('Creating payment...')

    try {
      // Step 1: Create Payment Intent
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-payment-intent`, {
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

      const { clientSecret: cs, mfaRequired: mfaReq, paymentIntentId: piId } = await response.json()
      setPaymentIntentId(piId)
      setClientSecret(cs)

      if (mfaReq) {
        // Step 2a: MFA Required - Create payment method and store it
        setPaymentStatus('Setting up payment method...')
        const cardElement = elements.getElement(CardElement)
        
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        })

        if (error) {
          throw new Error(error.message)
        }

        setPaymentMethodId(paymentMethod.id)
        setMfaRequired(true)
        setShowMfa(true)
        setPaymentStatus('Payment method saved. MFA verification required.')
        
        // Send OTP
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount })
        })
        
      } else {
        // Step 2b: No MFA Required - Confirm payment immediately
        setPaymentStatus('Processing payment...')
        const cardElement = elements.getElement(CardElement)
        
        const { error, paymentIntent } = await stripe.confirmCardPayment(cs, {
          payment_method: {
            card: cardElement,
          }
        })

        if (error) {
          throw new Error(error.message)
        }

        if (paymentIntent.status === 'succeeded') {
          setPaymentStatus('Payment successful!')
          onPaymentSuccess({
            paymentIntent,
            orderId,
            amount,
            mfaUsed: false
          })
        }
      }
    } catch (error) {
      setPaymentStatus(`Payment failed: ${error.message}`)
      onPaymentError(error)
    } finally {
      if (!mfaRequired) {
        setIsProcessing(false)
      }
    }
  }

  const handleMfaSubmit = async (e) => {
    e.preventDefault()
    setPaymentStatus('Verifying OTP and confirming payment...')

    try {
      // First verify OTP
      const otpResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: 'default',
          orderId,
          otp,
          paymentIntentId
        })
      })

      const otpResult = await otpResponse.json()

      if (!otpResult.success) {
        throw new Error(otpResult.message || 'MFA verification failed')
      }

      // If OTP verified, confirm payment with Stripe using stored payment method
      setPaymentStatus('Processing payment...')
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentStatus('Payment successful with MFA!')
        onPaymentSuccess({
          paymentIntent,
          orderId,
          amount,
          mfaUsed: true,
          mfaReceipt: otpResult.mfaReceipt
        })
      }
    } catch (error) {
      setPaymentStatus(`Payment failed: ${error.message}`)
      onPaymentError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          💳 Secure Payment
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          Order: {orderId} • Amount: ${amount}
        </p>
      </div>

      <div className="p-6">
        {!showMfa ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                <CardElement options={cardStyle} />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={!stripe || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                `Pay $${amount}`
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-amber-800 font-semibold flex items-center gap-2">
                🔐 Multi-Factor Authentication Required
              </h4>
              <p className="text-amber-700 text-sm mt-1">
                This transaction requires additional verification. Please enter the OTP sent to your device.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP Code:
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest font-mono"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isProcessing || otp.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Verifying...
                </>
              ) : (
                'Verify & Pay'
              )}
            </button>
          </form>
        )}

        {paymentStatus && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
            paymentStatus.includes('successful') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : paymentStatus.includes('failed')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {paymentStatus}
          </div>
        )}
      </div>
    </div>
  )
}

function StripePaymentForm({ orderId, amount, onPaymentSuccess, onPaymentError }) {
  return (
    <Elements stripe={stripePromise}>
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