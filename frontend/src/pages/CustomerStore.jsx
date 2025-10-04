import { useState } from 'react'
import { ShoppingBag, Search, Filter, Grid, List, X, ShoppingCartIcon, Star, Heart, Plus, Minus } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ShoppingCart from '../components/ShoppingCart'
import StripePaymentForm from '../components/StripePaymentForm'
import Message from '../components/Message'

// Demo products - one low-value, one high-value to demonstrate MFA threshold
const PRODUCTS = [
  { 
    id: 1, 
    name: 'Wireless Mouse', 
    price: 299.00, 
    category: 'Electronics',
    image: '🖱️',
    description: 'Premium wireless mouse with ergonomic design',
    rating: 4.8,
    stock: 15,
    features: ['Wireless Connectivity', 'Ergonomic Design', '6-Month Battery Life']
  },
  { 
    id: 2, 
    name: 'Premium Laptop', 
    price: 1299.00, 
    category: 'Electronics',
    image: '💻',
    description: 'High-performance laptop for professionals',
    rating: 4.9,
    stock: 8,
    features: ['16GB RAM', '512GB SSD', '15.6" 4K Display']
  }
]

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin
const MERCHANT_ID = 'demo_merchant_001'

function CustomerStore() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [message, setMessage] = useState(null)
  const [wishlist, setWishlist] = useState(new Set())

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    setMessage({ type: 'success', text: `${product.name} added to cart!` })
    setTimeout(() => setMessage(null), 3000)
  }

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId)
      } else {
        newWishlist.add(productId)
      }
      return newWishlist
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Your cart is empty!' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    setShowCart(false)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (result) => {
    setMessage({ type: 'success', text: 'Payment successful! Thank you for your purchase.' })
    setCart([])
    setShowPayment(false)
    setTimeout(() => setMessage(null), 5000)
  }

  const handlePaymentError = (error) => {
    setMessage({ type: 'error', text: `Payment failed: ${error.message}` })
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div className="min-h-screen">
      <div className="page-shell">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="eyebrow">TrustJS Interactive Demo</p>
          <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4">
            Trust is the Only Way
          </h1>
          <p className="text-lg text-theme-text/70 mb-8 max-w-2xl mx-auto">
            Experience blockchain-powered fraud detection in action. Test our MFA system with real payment flows and see how trust is built through verification.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <a 
              href="/merchant" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200 border border-purple-500 shadow-lg shadow-purple-500/20"
            >
              📊 View Merchant Portal
            </a>
            <a 
              href="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-theme-text font-semibold rounded-xl transition-all duration-200 border border-white/20"
            >
              📦 Integrate Our SDK
            </a>
          </div>

          {/* Cart Summary Badge */}
          {getTotalItems() > 0 && (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-full">
              <ShoppingBag className="h-5 w-5 text-purple-400" />
              <span className="text-theme-text font-medium">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} · ${getTotalAmount().toFixed(2)}
              </span>
              <button
                onClick={() => setShowCart(true)}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-colors"
              >
                View Cart
              </button>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="glass-panel mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-theme-text mb-2">How It Works</h2>
            <p className="text-theme-text/60">Follow these simple steps to test the fraud detection system</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-purple-500/30">
                  1
                </div>
                <h3 className="text-lg font-semibold text-theme-text mb-2">Select Products</h3>
                <p className="text-sm text-theme-text/60 leading-relaxed">
                  Choose from our demo products. Try both low and high-value items to see different security flows.
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50"></div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-cyan-500/30">
                  2
                </div>
                <h3 className="text-lg font-semibold text-theme-text mb-2">Complete Checkout</h3>
                <p className="text-sm text-theme-text/60 leading-relaxed">
                  Orders over $500 automatically trigger MFA verification. Check your terminal for the OTP code.
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-cyan-500/50 to-green-500/50"></div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-green-500/30">
                3
              </div>
              <h3 className="text-lg font-semibold text-theme-text mb-2">View Analytics</h3>
              <p className="text-sm text-theme-text/60 leading-relaxed">
                Visit the Merchant Portal to see real-time transaction logs and blockchain verification records.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Products */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-theme-text mb-2">Demo Products</h2>
            <p className="text-theme-text/60">
              💡 Transactions over <span className="text-purple-400 font-semibold">$500</span> require MFA verification
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PRODUCTS.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
                isWishlisted={wishlist.has(product.id)}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <ShoppingCart
          items={cart}
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <StripePaymentForm
              orderId={`order_${Date.now()}`}
              amount={getTotalAmount().toFixed(2)}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-4 px-4 py-2 text-theme-text/70 hover:text-theme-text transition-colors text-sm"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}

      {/* Message Component */}
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  )
}

export default CustomerStore