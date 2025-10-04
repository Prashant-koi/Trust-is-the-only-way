

function Cart({ cart, total, onCheckout, isProcessing }) {
  return (
    <div className="cart">
      <h2>🛒 Your Cart</h2>
      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="cart-item">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
      <div className="cart-total">
        Total: ${total.toFixed(2)}
      </div>
      <button 
        className="checkout-btn" 
        onClick={onCheckout}
        disabled={isProcessing || cart.length === 0}
      >
        {isProcessing ? 'Processing...' : '🔒 Proceed to Secure Checkout'}
      </button>
    </div>
  )
}

export default Cart