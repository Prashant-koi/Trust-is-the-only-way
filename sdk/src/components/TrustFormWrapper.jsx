import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { useTrustJSContext } from './TrustJSProvider.jsx'
import { TrustForm } from './TrustForm.jsx'

/**
 * Wrapper component that provides isolated Stripe Elements context for each form
 * This prevents "Can only create one Element of type card" errors
 */
export default function TrustFormWrapper(props) {
  const trustjs = useTrustJSContext()
  
  if (!trustjs || !trustjs.stripePromise) {
    return (
      <div className="trustjs-loading">
        <div className="trustjs-spinner" />
        <p>Loading payment form...</p>
      </div>
    )
  }

  const elementsOptions = {
    appearance: {
      theme: props.theme === 'light' ? 'stripe' : 'night',
      variables: {
        colorPrimary: '#6c63ff',
        colorBackground: props.theme === 'light' ? '#ffffff' : '#1a1a2e',
        colorText: props.theme === 'light' ? '#1a1a2e' : '#f8f9ff',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  }

  return (
    <Elements stripe={trustjs.stripePromise} options={elementsOptions}>
      <TrustForm {...props} />
    </Elements>
  )
}
