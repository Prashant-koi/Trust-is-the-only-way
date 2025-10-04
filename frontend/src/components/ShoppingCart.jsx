import { X, Minus, Plus, ShoppingBag } from 'lucide-react'

function ShoppingCart({ items = [], isOpen, onClose, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md glass-panel rounded-none border-l border-white/20 animate-slide-in-right">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-theme-text flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-theme-text" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-theme-text/30 mx-auto mb-4" />
              <p className="text-theme-text/60">Your cart is empty</p>
              <p className="text-theme-text/40 text-sm mt-1">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-theme-text">{item.name}</h3>
                      <p className="text-sm text-theme-text/60 mt-1">${item.price}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-theme-text">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/20 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-theme-text">Total</span>
              <span className="text-xl font-bold text-theme-text">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="primary w-full"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShoppingCart