import { useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import Cart from '../components/Cart'
import MfaModal from '../components/MfaModal'
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
  const [showMfaModal, setShowMfaModal] = useState(false)
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

    setIsProcessing(true)
    showMessage('Checking payment requirements...')

    const orderId = 'order_' + Date.now()
    setCurrentOrderId(orderId)
    const total = calculateTotal()

    try {
      // Step 1: Preauth
      const response = await fetch(`${BACKEND_URL}/api/preauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: MERCHANT_ID,
          orderId: orderId,
          amount: total,
          currency: 'USD'
        })
      })

      const preauth = await response.json()
      console.log('Preauth:', preauth)

      if (!preauth.mfaRequired) {
        // No MFA needed
        showMessage('✅ Payment successful! No MFA required for this amount.')
        setCart([])
        setIsProcessing(false)
        return
      }

      // Step 2: Show MFA modal
      showMessage('MFA required. Please verify your identity...')
      setShowMfaModal(true)
      setIsProcessing(false)

    } catch (error) {
      showMessage('❌ Error: ' + error.message, true)
      setIsProcessing(false)
    }
  }

  const handleMfaSuccess = (receipt) => {
    setShowMfaModal(false)
    let msg = `✅ Payment Successful!<br><br>
      Order: ${receipt.orderId}<br>
      Method: ${receipt.method.toUpperCase()}<br>
      Receipt: ${receipt.receiptId}<br>
      Hash: ${receipt.approvalHash.substring(0, 20)}...`
    
    if (receipt.blockchainTx) {
      msg += `<br><br>⛓️ <a href="${receipt.blockchainTx.explorerUrl}" target="_blank">View on Blockchain ↗</a>`
    }
    
    showMessage(msg)
    setCart([])
    setIsProcessing(false)
  }

  const handleMfaCancel = () => {
    setShowMfaModal(false)
    showMessage('❌ Payment cancelled', true)
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

      {showMfaModal && (
        <MfaModal
          orderId={currentOrderId}
          amount={calculateTotal()}
          onSuccess={handleMfaSuccess}
          onCancel={handleMfaCancel}
          backendUrl={BACKEND_URL}
          merchantId={MERCHANT_ID}
        />
      )}
    </div>
  )
}

export default CustomerStore