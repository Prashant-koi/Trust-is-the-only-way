import { useState, useCallback } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useTrustJSContext } from '../components/TrustJSProvider.jsx'

export function usePayment() {
  const stripe = useStripe()
  const elements = useElements()
  const trustjs = useTrustJSContext()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [currentStep, setCurrentStep] = useState('ready') // 'ready' | 'processing' | 'mfa' | 'completed' | 'failed'

  const createPayment = useCallback(async (options) => {
    setIsProcessing(true)
    setError(null)
    setCurrentStep('processing')

    try {
      const result = await trustjs.createPayment(options)
      setPaymentData(result)
      
      if (result.mfaRequired) {
        setCurrentStep('mfa')
      } else {
        setCurrentStep('ready')
      }
      
      return result
    } catch (err) {
      setError(err)
      setCurrentStep('failed')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [trustjs])

  const confirmPayment = useCallback(async (clientSecret, paymentMethodId) => {
    if (!stripe) {
      throw new Error('Stripe not loaded')
    }

    setIsProcessing(true)
    setError(null)
    setCurrentStep('processing')

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId
      })

      if (result.error) {
        throw result.error
      }

      setCurrentStep('completed')
      return result.paymentIntent
    } catch (err) {
      setError(err)
      setCurrentStep('failed')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [stripe])

  const createPaymentMethod = useCallback(async (billingDetails = {}) => {
    if (!stripe || !elements) {
      throw new Error('Stripe not ready')
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      throw new Error('Card element not found')
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      })

      if (error) {
        throw error
      }

      return paymentMethod
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [stripe, elements])

  const reset = useCallback(() => {
    setIsProcessing(false)
    setError(null)
    setPaymentData(null)
    setCurrentStep('ready')
  }, [])

  return {
    // State
    isProcessing,
    error,
    paymentData,
    currentStep,
    
    // Actions
    createPayment,
    confirmPayment,
    createPaymentMethod,
    reset,
    
    // Stripe utilities
    stripe,
    elements,
    
    // TrustJS instance
    trustjs
  }
}

export default usePayment