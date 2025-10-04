import { useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import Cart from '../components/Cart'
import StripePaymentForm from '../components/StripePaymentForm'
import Message from '../components/Message'

const PRODUCTS = [
  { id: 1, name: 'Wireless Mouse', price: 79.99, emoji: '🖱️' },
  { id: 2, name: 'Mechanical Keyboard', price: 149.99, emoji: '⌨️' },
  { id: 3, name: 'Premium Laptop', price: 1299.99, emoji: '💻' }
]

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin
const MERCHANT_ID = 'demo_merchant_001'

function CustomerStore() {
  const [cart, setCart] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState(null)
  const [message, setMessage] = useState({ text: '', isError: false })
  const [isProcessing, setIsProcessing] = useState(false)

  const addToCart = (product) => {
    setCart([...cart, product])
    setMessage({ text: '', isError: false })
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0)
  }

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError })
  }

  const checkout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    // Generate order ID and show Stripe payment form
    const orderId = 'order_' + Date.now()
    setCurrentOrderId(orderId)
    setShowPayment(true)
    showMessage('Please complete your payment below...')
  }

  const handlePaymentSuccess = (result) => {
    setShowPayment(false)
    
    let msg = `✅ Payment Successful!<br><br>
      Order: ${result.orderId}<br>
      Amount: $${result.amount}<br>
      Payment ID: ${result.paymentIntent.id}<br>`
    
    if (result.mfaUsed) {
      msg += `MFA: ${result.mfaReceipt.method.toUpperCase()}<br>
      Receipt: ${result.mfaReceipt.receiptId}<br>
      Hash: ${result.mfaReceipt.approvalHash.substring(0, 20)}...`
      
      if (result.mfaReceipt.blockchainTx) {
        msg += `<br><br>⛓️ <a href="${result.mfaReceipt.blockchainTx.explorerUrl}" target="_blank">View on Blockchain ↗</a>`
      }
    } else {
      msg += `MFA: Not required (amount under threshold)`
    }
    
    showMessage(msg)
    setCart([])
    setIsProcessing(false)
  }

  const handlePaymentError = (error) => {
    setShowPayment(false)
    showMessage(`❌ Payment failed: ${error.message}`, true)
    setIsProcessing(false)
  }

  return (
    <div className="store-container">
      <header>
        <h1>🛡️ PayShield Demo Store</h1>
        <p className="subtitle">Experience secure payments with Multi-Factor Authentication</p>
      </header>

      <ProductGrid products={PRODUCTS} onAddToCart={addToCart} />
      
      <Cart 
        cart={cart} 
        total={calculateTotal()} 
        onCheckout={checkout}
        isProcessing={isProcessing}
      />

      <Message message={message} />

      {showPayment && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <button 
              className="close-payment" 
              onClick={() => setShowPayment(false)}
            >
              ✕
            </button>
            <StripePaymentForm
              orderId={currentOrderId}
              amount={calculateTotal()}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerStore