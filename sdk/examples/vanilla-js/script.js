import TrustJS from '../../dist/index.esm.js'

// Initialize TrustJS
const trustjs = new TrustJS({
  publishableKey: 'pk_test_51SEPdMHqjaPgoLNariaByJzqugHs05citHWNSmTx2z5Zkn9oH85qD1KYXRMubgt3PYa0q43hIZ0OAbLXmcoxMZWO00cd448f5V',
  merchantId: 'demo_merchant_001',
  apiUrl: 'http://localhost:3001',
  theme: 'dark'
})

const payButton = document.getElementById('payButton')
const paymentForm = document.getElementById('paymentForm')
const statusDiv = document.getElementById('status')

function showStatus(message, type = 'info') {
  statusDiv.innerHTML = `
    <div class="trustjs-form__status trustjs-form__status--${type}">
      ${message}
    </div>
  `
}

payButton.addEventListener('click', async () => {
  try {
    payButton.style.display = 'none'
    showStatus('Creating payment session...', 'info')

    // Create payment
    const payment = await trustjs.createPayment({
      amount: 1299.99,
      orderId: `order_${Date.now()}`,
      currency: 'usd',
      customer: {
        email: 'customer@example.com',
        name: 'John Doe'
      }
    })

    showStatus(`Payment created. ${payment.mfaRequired ? 'MFA required.' : 'Processing...'}`, 'info')

    if (payment.mfaRequired) {
      // Simulate MFA flow
      const otp = prompt('Enter 6-digit OTP from your terminal:')
      
      if (otp) {
        showStatus('Verifying MFA...', 'info')
        
        const verification = await trustjs.verifyMfa(`order_${Date.now()}`, otp)
        
        if (verification.success) {
          showStatus('🎉 Payment completed successfully!', 'success')
        } else {
          throw new Error('MFA verification failed')
        }
      } else {
        throw new Error('OTP required')
      }
    } else {
      showStatus('🎉 Payment completed successfully!', 'success')
    }

  } catch (error) {
    showStatus(`❌ Payment failed: ${error.message}`, 'error')
    payButton.style.display = 'block'
  }
})

// Event listeners
trustjs.on('payment:started', () => {
  console.log('Payment started')
})

trustjs.on('payment:confirmed', (payment) => {
  console.log('Payment confirmed:', payment)
})

trustjs.on('mfa:verified', (data) => {
  console.log('MFA verified:', data)
})

console.log('TrustJS initialized:', trustjs.getVersion())