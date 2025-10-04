import React, { useState } from 'react'
import { useTrustJS } from '../hooks/useTrustJS.js'
import TrustFormWrapper from './TrustFormWrapper.jsx'
import TrustModal from './TrustModal.jsx'

export default function TrustButton({
  amount,
  orderId,
  currency = 'usd',
  customer = {},
  onSuccess,
  onError,
  onMfaRequired,
  className = '',
  children,
  variant = 'button', // 'button' | 'inline' | 'modal'
  size = 'medium', // 'small' | 'medium' | 'large'
  theme = 'primary', // 'primary' | 'secondary' | 'minimal'
  disabled = false,
  loading = false
}) {
  const trustjs = useTrustJS()
  const [showForm, setShowForm] = useState(variant === 'inline')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClick = () => {
    if (variant === 'modal') {
      setShowForm(true)
    } else if (variant === 'button') {
      setShowForm(true)
    }
  }

  const handleSuccess = (result) => {
    setShowForm(false)
    onSuccess?.(result)
  }

  const handleError = (error) => {
    setShowForm(false)
    onError?.(error)
  }

  const baseClasses = [
    'trustjs-button',
    `trustjs-button--${size}`,
    `trustjs-button--${theme}`,
    className
  ].filter(Boolean).join(' ')

  if (variant === 'inline' || showForm) {
    const FormComponent = variant === 'modal' ? TrustModal : TrustFormWrapper
    
    return (
      <FormComponent
        amount={amount}
        orderId={orderId}
        currency={currency}
        customer={customer}
        onSuccess={handleSuccess}
        onError={handleError}
        onMfaRequired={onMfaRequired}
        onCancel={variant !== 'inline' ? () => setShowForm(false) : undefined}
        theme={theme}
      />
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading || isProcessing}
      className={baseClasses}
    >
      {loading || isProcessing ? (
        <>
          <span className="trustjs-spinner" />
          Processing...
        </>
      ) : (
        children || `🔒 Pay $${amount}`
      )}
    </button>
  )
}