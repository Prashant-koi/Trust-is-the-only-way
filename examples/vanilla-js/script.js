import TrustJS from '../../dist/index.esm.js'

// Initialize TrustJS
const trustjs = new TrustJS({
  publishableKey: 'pk_test_51SEPdMHqjaPgoLNariaByJzqugHs05citHWNSmTx2z5Zkn9oH85qD1KYXRMubgt3PYa0q43hIZ0OAbLXmcoxMZWO00cd448f5V',
  merchantId: 'demo_merchant_001',
  apiUrl: 'http://localhost:3001',
  theme: 'dark'
})

const statusDiv = document.getElementById('status')

function showStatus(message, type = 'info') {
  statusDiv.innerHTML = `<div class="status status--${type}">${message}</div>`
}

async function handlePurchase(productName, amount, button) {
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    button.disabled = true
    button.innerHTML = '<span class="trustjs-spinner"></span> Processing...'
    
    showStatus('Creating secure payment session...', 'info')

    // Create payment
    const payment = await trustjs.createPayment({
      amount,
      orderId,
      currency: 'usd',
      customer: {
        email: 'customer@example.com',
        name: 'Demo Customer'
      }
    })

    console.log('Payment created:', payment)

    if (payment.mfaRequired) {
      showStatus('🔐 MFA verification required. Check your backend terminal for OTP.', 'info')
      
      // Simulate MFA flow - in real app you'd show a proper form
      const otp = prompt('Enter 6-digit OTP from your backend terminal:')
      
      if (otp && otp.length === 6) {
        showStatus('Verifying MFA...', 'info')
        
        const verification = await trustjs.verifyMfa(orderId, otp)
        
        if (verification.success) {
          showStatus(`🎉 Payment successful! You purchased ${productName} for $${amount}`, 'success')
        } else {
          throw new Error('MFA verification failed')
        }
      } else {
        throw new Error('Valid OTP required')
      }
    } else {
      showStatus(`🎉 Payment successful! You purchased ${productName} for $${amount}`, 'success')
    }

  } catch (error) {
    console.error('Payment error:', error)
    showStatus(`❌ Payment failed: ${error.message}`, 'error')
  } finally {
    button.disabled = false
    button.innerHTML = '🔒 Buy Now'
  }
}

// Event listeners
document.getElementById('laptop-btn').addEventListener('click', (e) => {
  handlePurchase('Gaming Laptop Pro', 1299.99, e.target)
})

document.getElementById('phone-btn').addEventListener('click', (e) => {
  handlePurchase('Smartphone Ultra', 899.99, e.target)
})

// TrustJS event listeners
trustjs.on('payment:started', (data) => {
  console.log('Payment started:', data)
})

trustjs.on('payment:confirmed', (payment) => {
  console.log('Payment confirmed:', payment)
})

trustjs.on('mfa:verified', (data) => {
  console.log('MFA verified:', data)
})

console.log('🔒 TrustJS initialized:', trustjs.getVersion())
showStatus('TrustJS SDK loaded successfully. Try purchasing a product!', 'success')