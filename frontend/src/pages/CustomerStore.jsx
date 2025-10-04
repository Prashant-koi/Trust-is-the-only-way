import { useState } from 'react'
import { ShoppingBag, Search, Filter, Grid, List, X, ShoppingCartIcon, Star, Heart, Plus, Minus } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ShoppingCart from '../components/ShoppingCart'
import StripePaymentForm from '../components/StripePaymentForm'
import Message from '../components/Message'

// Product catalog with diverse items
const PRODUCTS = [
  { 
    id: 1, 
    name: 'Gaming Mouse Pro', 
    price: 79.99, 
    category: 'Gaming',
    image: '🖱️',
    description: 'High-precision gaming mouse with RGB lighting',
    rating: 4.8,
    stock: 15,
    features: ['16000 DPI', 'RGB Lighting', 'Ergonomic Design']
  },
  { 
    id: 2, 
    name: 'Mechanical Keyboard Elite', 
    price: 149.99, 
    category: 'Gaming',
    image: '⌨️',
    description: 'Premium mechanical keyboard with tactile switches',
    rating: 4.9,
    stock: 8,
    features: ['Cherry MX Switches', 'Backlit Keys', 'USB-C']
  },
  { 
    id: 3, 
    name: 'Premium Laptop', 
    price: 1299.99, 
    category: 'Computers',
    image: '💻',
    description: 'High-performance laptop for professionals',
    rating: 4.7,
    stock: 5,
    features: ['16GB RAM', '512GB SSD', '15.6" Display']
  },
  { 
    id: 4, 
    name: 'Wireless Headphones', 
    price: 199.99, 
    category: 'Audio',
    image: '🎧',
    description: 'Premium noise-cancelling headphones',
    rating: 4.6,
    stock: 12,
    features: ['Active ANC', '30h Battery', 'Bluetooth 5.0']
  },
  { 
    id: 5, 
    name: 'Smartphone Pro', 
    price: 899.99, 
    category: 'Mobile',
    image: '📱',
    description: 'Latest smartphone with advanced camera',
    rating: 4.8,
    stock: 7,
    features: ['108MP Camera', '5G Ready', '128GB Storage']
  },
  { 
    id: 6, 
    name: 'Tablet Ultra', 
    price: 599.99, 
    category: 'Mobile',
    image: '📱',
    description: 'Professional tablet for creativity',
    rating: 4.5,
    stock: 10,
    features: ['11" Display', 'Stylus Support', '256GB Storage']
  },
  { 
    id: 7, 
    name: 'Smart Watch', 
    price: 299.99, 
    category: 'Wearables',
    image: '⌚',
    description: 'Advanced fitness and smart features',
    rating: 4.4,
    stock: 20,
    features: ['Heart Rate Monitor', 'GPS', 'Water Resistant']
  },
  { 
    id: 8, 
    name: 'Wireless Speaker', 
    price: 129.99, 
    category: 'Audio',
    image: '🔊',
    description: 'Portable speaker with rich sound',
    rating: 4.3,
    stock: 18,
    features: ['360° Sound', '12h Battery', 'Waterproof']
  },
  { 
    id: 9, 
    name: 'Gaming Monitor', 
    price: 449.99, 
    category: 'Gaming',
    image: '🖥️',
    description: '27" 4K gaming monitor with high refresh rate',
    rating: 4.7,
    stock: 6,
    features: ['4K Resolution', '144Hz', 'HDR Support']
  },
  { 
    id: 10, 
    name: 'USB-C Hub', 
    price: 89.99, 
    category: 'Accessories',
    image: '🔌',
    description: 'Multi-port hub with fast charging',
    rating: 4.2,
    stock: 25,
    features: ['7-in-1 Hub', 'USB-C PD', 'HDMI 4K']
  }
]

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin
const MERCHANT_ID = 'demo_merchant_001'

function CustomerStore() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [message, setMessage] = useState(null)
  const [wishlist, setWishlist] = useState(new Set())

  const categories = ['All', 'Gaming', 'Computers', 'Audio', 'Mobile', 'Wearables', 'Accessories']

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
      {/* Hero Section */}
      <div className="page-shell">
        <div className="page-header">
          <div>
            <p className="eyebrow">Premium Technology Store</p>
            <h1>Secure Shopping Experience</h1>
            <p className="subtitle">
              Discover premium tech products with advanced fraud protection and seamless checkout experience.
            </p>
          </div>
          <div className="glass-panel" style={{minWidth: '220px'}}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-theme-text/70">Shopping Cart</span>
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 rounded-lg bg-white/8 hover:bg-white/12 transition-all duration-200 border border-white/10"
              >
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
            <div className="text-2xl font-bold text-theme-text">${getTotalAmount().toFixed(2)}</div>
            <div className="text-sm text-theme-text/60">{getTotalItems()} items</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-panel">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text/50 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/8 border border-white/15 rounded-lg text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white border border-purple-500'
                      : 'bg-white/8 text-theme-text/70 hover:bg-white/12 border border-white/15'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 border ${
                  viewMode === 'grid' 
                    ? 'bg-white/15 border-white/25' 
                    : 'bg-white/8 hover:bg-white/12 border-white/15'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 border ${
                  viewMode === 'list' 
                    ? 'bg-white/15 border-white/25' 
                    : 'bg-white/8 hover:bg-white/12 border-white/15'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              isWishlisted={wishlist.has(product.id)}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="glass-panel text-center py-12">
            <p className="text-theme-text/60">No products found matching your criteria.</p>
          </div>
        )}
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