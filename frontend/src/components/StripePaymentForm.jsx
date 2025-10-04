import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import './StripePaymentForm.css'

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
    <div className="stripe-payment-form">
      <div className="payment-header">
        <h3>💳 Secure Payment</h3>
        <p>Order: {orderId} • Amount: ${amount}</p>
      </div>

      {!showMfa ? (
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="card-element-container">
            <label>Card Information</label>
            <CardElement options={cardStyle} />
          </div>
          
          <button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="pay-button"
          >
            {isProcessing ? 'Processing...' : `Pay $${amount}`}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit} className="mfa-form">
          <div className="mfa-notice">
            <h4>🔐 Multi-Factor Authentication Required</h4>
            <p>This transaction requires additional verification. Please enter the OTP sent to your device.</p>
          </div>
          
          <div className="otp-input-container">
            <label>Enter OTP Code:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength="6"
              className="otp-input"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing || otp.length !== 6}
            className="verify-button"
          >
            {isProcessing ? 'Verifying...' : 'Verify & Pay'}
          </button>
        </form>
      )}

      {paymentStatus && (
        <div className={`payment-status ${paymentStatus.includes('successful') ? 'success' : ''}`}>
          {paymentStatus}
        </div>
      )}
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