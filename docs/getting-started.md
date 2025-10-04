# Getting Started with TrustJS

TrustJS is a secure payment SDK with built-in MFA protection, fraud detection, and blockchain auditing.

## Installation

```bash
npm install trustjs
# or
yarn add trustjs
# or  
pnpm add trustjs
```

## Quick Start

### Vanilla JavaScript

```javascript
import TrustJS from 'trustjs'
import 'trustjs/dist/trustjs.css'

const trustjs = new TrustJS({
  publishableKey: 'pk_test_...',
  merchantId: 'your_merchant_id'
})

// Create a payment
const payment = await trustjs.createPayment({
  amount: 99.99,
  orderId: 'order_123'
})

// Handle MFA if required
if (payment.mfaRequired) {
  const otp = '123456' // Get from user input
  await trustjs.verifyMfa('order_123', otp)
}
```

### React

```jsx
import { TrustJSProvider, TrustButton } from 'trustjs'
import 'trustjs/dist/trustjs.css'

function App() {
  return (
    <TrustJSProvider
      publishableKey="pk_test_..."
      merchantId="your_merchant_id"
    >
      <TrustButton
        amount="99.99"
        orderId="order_123"
        onSuccess={(payment) => console.log('Success!', payment)}
        onError={(error) => console.error('Error:', error)}
      >
        Buy Now - $99.99
      </TrustButton>
    </TrustJSProvider>
  )
}
```

## Configuration

```javascript
const config = {
  publishableKey: 'pk_test_...', // Required
  merchantId: 'your_merchant_id', // Required
  apiUrl: 'https://api.trustjs.dev', // Optional
  theme: 'dark', // 'dark' | 'light'
  mfaThreshold: 500, // Amount threshold for MFA
  enableBlockchain: true,
  enableAnalytics: true
}
```

## Next Steps

- [API Reference](./api-reference.md)
- [React Components](./components.md)
- [React Hooks](./hooks.md)
- [Customization](./customization.md)