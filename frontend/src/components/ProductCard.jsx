import { Star, Heart, Plus } from 'lucide-react'

function ProductCard({ product, viewMode, isWishlisted, onAddToCart, onToggleWishlist }) {
  if (viewMode === 'list') {
    return (
      <div className="glass-panel flex gap-6 items-center">
        <div className="text-6xl">{product.image}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-theme-text">{product.name}</h3>
              <p className="text-theme-text/60 text-sm">{product.description}</p>
            </div>
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isWishlisted 
                  ? 'text-red-400 bg-red-400/10' 
                  : 'text-theme-text/40 hover:text-red-400 hover:bg-red-400/5'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-theme-text/70">{product.rating}</span>
            </div>
            <span className="text-sm text-theme-text/60">•</span>
            <span className="text-sm text-theme-text/60">{product.stock} in stock</span>
            <span className="text-sm text-theme-text/60">•</span>
            <span className="text-sm text-purple-400">{product.category}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-theme-text">${product.price}</div>
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="primary flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel group">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{product.image}</div>
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isWishlisted 
              ? 'text-red-400 bg-red-400/10' 
              : 'text-theme-text/40 hover:text-red-400 hover:bg-red-400/5'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-theme-text mb-2">{product.name}</h3>
      <p className="text-theme-text/60 text-sm mb-3 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm text-theme-text/70">{product.rating}</span>
        </div>
        <span className="text-theme-text/40">•</span>
        <span className="text-sm text-theme-text/60">{product.stock} left</span>
      </div>

      <div className="mb-4">
        <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md border border-purple-400/20">
          {product.category}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {product.features.map((feature, index) => (
          <span key={index} className="text-xs text-theme-text/60 bg-white/5 px-2 py-1 rounded border border-white/10">
            {feature}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-theme-text">${product.price}</div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="primary flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-3.5 w-3.5" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard