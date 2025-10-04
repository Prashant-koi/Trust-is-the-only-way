import { useState } from 'react'


function MfaModal({ orderId, amount, onSuccess, onCancel, backendUrl, merchantId }) {
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendOtp = async () => {
    setIsLoading(true)
    setStatus('Sending OTP...')
    
    try {
      const response = await fetch(`${backendUrl}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount })
      })

      const result = await response.json()

      if (result.success) {
        setShowOtp(true)
        setStatus('✅ OTP sent! Check your terminal.')
      } else {
        setStatus('❌ Failed to send OTP')
      }
    } catch (error) {
      setStatus('❌ Error: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setStatus('❌ Please enter 6-digit code')
      return
    }

    setIsLoading(true)
    setStatus('Verifying...')

    try {
      const response = await fetch(`${backendUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId,
          orderId,
          otp
        })
      })

      const result = await response.json()

      if (result.success) {
        onSuccess(result.mfaReceipt)
      } else {
        setStatus('❌ ' + result.message)
      }
    } catch (error) {
      setStatus('❌ Error: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
  }

  return (
    <div className="mfa-modal">
      <div className="modal-content">
        <h2>🔐 Secure Your Payment</h2>
        <p>This high-value transaction requires additional verification.</p>
        
        {!showOtp ? (
          <div className="mfa-options">
            <button 
              className="modal-btn" 
              onClick={sendOtp}
              disabled={isLoading}
            >
              📱 Send One-Time Code
            </button>
          </div>
        ) : (
          <div className="otp-section">
            <input
              type="text"
              className="otp-input"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              autoFocus
            />
            <button 
              className="modal-btn" 
              onClick={verifyOtp}
              disabled={isLoading || otp.length !== 6}
            >
              ✓ Verify Code
            </button>
          </div>
        )}
        
        <div className="mfa-status">{status}</div>
        
        <button 
          className="modal-btn cancel" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default MfaModal