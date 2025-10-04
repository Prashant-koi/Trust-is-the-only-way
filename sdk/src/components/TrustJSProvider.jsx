import React, { createContext, useContext, useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import TrustJS from '../core/TrustJS.js'

const TrustJSContext = createContext(null)

export function TrustJSProvider({ 
  children, 
  publishableKey, 
  merchantId, 
  config = {} 
}) {
  const [trustjs, setTrustjs] = useState(null)
  const [stripePromise, setStripePromise] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      // Initialize TrustJS
      const instance = new TrustJS({
        publishableKey,
        merchantId,
        ...config
      })

      // Initialize Stripe and attach to instance
      const stripe = loadStripe(publishableKey)
      instance.stripePromise = stripe

      setTrustjs(instance)
      setStripePromise(stripe)
      setIsReady(true)

      console.log('🔒 TrustJSProvider initialized')

    } catch (error) {
      console.error('TrustJS Provider initialization failed:', error)
      setIsReady(false)
    }
  }, [publishableKey, merchantId, config])

  if (!isReady || !trustjs || !stripePromise) {
    return (
      <div className="trustjs-loading">
        <div className="trustjs-spinner" />
        <p>Loading TrustJS...</p>
      </div>
    )
  }

  return (
    <TrustJSContext.Provider value={trustjs}>
      {children}
    </TrustJSContext.Provider>
  )
}

export const useTrustJSContext = () => {
  const context = useContext(TrustJSContext)
  if (!context) {
    throw new Error('useTrustJSContext must be used within TrustJSProvider')
  }
  return context
}

export default TrustJSProvider