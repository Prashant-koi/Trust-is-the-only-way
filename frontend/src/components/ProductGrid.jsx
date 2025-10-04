import './ProductGrid.css'

function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="products">
      {products.map(product => (
        <div key={product.id} className="product">
          <h3>{product.emoji} {product.name}</h3>
          <div className="price">${product.price.toFixed(2)}</div>
          <button onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid