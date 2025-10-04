import React from 'react'
import { TrustJSProvider, TrustButton } from 'trustjs'
import 'trustjs/dist/trustjs.css'
import './App.css'

function App() {
  const handleSuccess = (payment) => {
    console.log('Payment successful:', payment)
    alert('🎉 Payment completed successfully!')
  }

  const handleError = (error) => {
    console.error('Payment error:', error)
    alert(`❌ Payment failed: ${error.message}`)
  }

  const handleMfaRequired = (paymentIntent) => {
    console.log('MFA required for payment:', paymentIntent)
  }

  return (
    <TrustJSProvider
      publishableKey="pk_test_51SEPdMHqjaPgoLNariaByJzqugHs05citHWNSmTx2z5Zkn9oH85qD1KYXRMubgt3PYa0q43hIZ0OAbLXmcoxMZWO00cd448f5V"
      merchantId="demo_merchant_001"
      config={{
        apiUrl: 'http://localhost:3001',
        theme: 'dark',
        mfaThreshold: 500
      }}
    >
      <div className="app">
        <header className="app-header">
          <h1>🛒 TrustJS React Example</h1>
          <p>Secure payments with MFA protection</p>
        </header>

        <main className="app-main">
          <div className="product-grid">
            <div className="product-card">
              <div className="product-image">💻</div>
              <h3>Gaming Laptop</h3>
              <p>High-performance laptop for gaming</p>
              <div className="product-price">$1,299.99</div>
              
              <TrustButton
                amount="1299.99"
                orderId={`order_${Date.now()}`}
                customer={{ 
                  email: 'customer@example.com',
                  name: 'John Doe'
                }}
                onSuccess={handleSuccess}
                onError={handleError}
                onMfaRequired={handleMfaRequired}
                variant="button"
                size="medium"
              >
                🔒 Buy Now
              </TrustButton>
            </div>

            <div className="product-card">
              <div className="product-image">📱</div>
              <h3>Smartphone Pro</h3>
              <p>Latest flagship smartphone</p>
              <div className="product-price">$899.99</div>
              
              <TrustButton
                amount="899.99"
                orderId={`order_${Date.now() + 1}`}
                variant="inline"
                onSuccess={handleSuccess}
                onError={handleError}
                onMfaRequired={handleMfaRequired}
              />
            </div>
          </div>
        </main>
      </div>
    </TrustJSProvider>
  )
}

export default App