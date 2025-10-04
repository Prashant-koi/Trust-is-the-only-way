import React, { useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { useTrustJSContext } from './TrustJSProvider.jsx'
import { TrustForm } from './TrustForm.jsx'

export function TrustModal({
  amount,
  orderId,
  currency,
  customer,
  onSuccess,
  onError,
  onMfaRequired,
  onCancel,
  theme = 'dark'
}) {
  const trustjs = useTrustJSContext()

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel?.()
    }
  }

  if (!trustjs || !trustjs.stripePromise) {
    return null
  }

  const elementsOptions = {
    appearance: {
      theme: theme === 'light' ? 'stripe' : 'night',
      variables: {
        colorPrimary: '#6c63ff',
        colorBackground: theme === 'light' ? '#ffffff' : '#1a1a2e',
        colorText: theme === 'light' ? '#1a1a2e' : '#f8f9ff',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  }

  return (
    <div className="trustjs-modal-backdrop" onClick={handleBackdropClick}>
      <div className="trustjs-modal">
        <div className="trustjs-modal__header">
          <button 
            className="trustjs-modal__close"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="trustjs-modal__content">
          <Elements stripe={trustjs.stripePromise} options={elementsOptions}>
            <TrustForm
              amount={amount}
              orderId={orderId}
              currency={currency}
              customer={customer}
              onSuccess={(result) => {
                onSuccess?.(result)
              }}
              onError={(error) => {
                onError?.(error)
              }}
              onMfaRequired={onMfaRequired}
              onCancel={onCancel}
              showCancel={false}
              theme={theme}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}

export default TrustModal