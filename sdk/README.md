# TrustJS 🔒

> Secure MFA payment SDK with fraud detection and blockchain auditing

[![npm version](https://badge.fury.io/js/trustjs.svg)](https://www.npmjs.com/package/trustjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Installation

```bash
npm install trustjs
# or
yarn add trustjs
# or
pnpm add trustjs
```

### Basic Usage

#### Vanilla JavaScript
```javascript
import TrustJS from 'trustjs'
import 'trustjs/dist/trustjs.css'

const trustjs = new TrustJS({
  publishableKey: 'pk_test_...',
  merchantId: 'your_merchant_id'
})

// Create payment
const payment = await trustjs.createPayment({
  amount: 99.99,
  orderId: 'order_123'
})
```

#### React
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

## 📋 Features

- ✅ **Secure Payments** - Stripe integration with enhanced security
- ✅ **MFA Protection** - Multi-factor authentication for high-value transactions
- ✅ **Fraud Detection** - Real-time risk assessment and pattern detection
- ✅ **Blockchain Auditing** - Immutable transaction logging
- ✅ **React Components** - Pre-built UI components
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Customizable Themes** - Dark and light themes with CSS variables
- ✅ **Mobile Friendly** - Responsive design and mobile optimization

## 📖 Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [React Components](./docs/components.md)
- [React Hooks](./docs/hooks.md)
- [Customization](./docs/customization.md)

## 🔧 Configuration

```javascript
const trustjs = new TrustJS({
  // Required
  publishableKey: 'pk_test_...',
  merchantId: 'your_merchant_id',
  
  // Optional
  apiUrl: 'https://api.trustjs.dev',
  environment: 'production', // 'development' | 'production'
  theme: 'dark', // 'dark' | 'light'
  mfaThreshold: 500, // Amount threshold for MFA requirement
  enableBlockchain: true,
  enableAnalytics: true
})
```

## 🎨 Theming

TrustJS supports custom themes through CSS variables:

```css
:root {
  --trustjs-primary: #6c63ff;
  --trustjs-background: #1a1a2e;
  --trustjs-text: #f8f9ff;
  --trustjs-border: rgba(255, 255, 255, 0.15);
}
```

## 🧪 Examples

Check out the [examples directory](./examples/) for complete implementation examples:

- [Vanilla JavaScript](./examples/vanilla-js/)
- [React Basic](./examples/react-basic/)
- [React Advanced](./examples/react-advanced/)
- [Next.js](./examples/nextjs/)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.