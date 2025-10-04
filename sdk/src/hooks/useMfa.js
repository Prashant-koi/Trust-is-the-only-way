import { useState, useCallback } from 'react'
import { useTrustJSContext } from '../components/TrustJSProvider.jsx'

export function useMfa() {
  const trustjs = useTrustJSContext()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [otpSent, setOtpSent] = useState(false)

  const sendOtp = useCallback(async (orderId, amount) => {
    setIsProcessing(true)
    setError(null)

    try {
      const result = await trustjs.mfaManager.sendOtp(orderId, amount)
      setOtpSent(true)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [trustjs])

  const verifyOtp = useCallback(async (orderId, otp) => {
    setIsProcessing(true)
    setError(null)

    try {
      const result = await trustjs.mfaManager.verifyCode(orderId, otp)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [trustjs])

  const resetMfa = useCallback(() => {
    setOtpSent(false)
    setError(null)
  }, [])

  return {
    // State
    isProcessing,
    error,
    otpSent,
    
    // Actions
    sendOtp,
    verifyOtp,
    resetMfa
  }
}

export default useMfa