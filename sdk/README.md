# TrustJS SDK 🔒

> Blockchain-powered MFA and fraud detection for secure payments. Trust is the only way.

[![npm version](https://img.shields.io/npm/v/trust-mfa-sdk.svg)](https://www.npmjs.com/package/trust-mfa-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Installation

```bash
npm install trust-mfa-sdk
# or
yarn add trust-mfa-sdk
# or
pnpm add trust-mfa-sdk
```

### Basic Usage

```javascript
import TrustJS from 'trust-mfa-sdk'
import 'trust-mfa-sdk/dist/trustjs.css'

const trustjs = new TrustJS({
  publishableKey: 'pk_test_...',
  merchantId: 'your_merchant_id',
  apiUrl: 'https://api.trustjs.com'
})

// Create a payment
const payment = await trustjs.createPayment({
  amount: 599.99,
  orderId: 'order_123'
})
```

### React Components

```jsx
import { TrustJSProvider, TrustButton } from 'trust-mfa-sdk'
import 'trust-mfa-sdk/dist/trustjs.css'

function App() {
  return (
    <TrustJSProvider
      publishableKey="pk_test_..."
      merchantId="your_merchant_id"
      apiUrl="https://api.trustjs.com"
    >
      <TrustButton
        amount={599.99}
        orderId="order_123"
        onSuccess={(payment) => console.log('Success!', payment)}
        onError={(error) => console.error('Error:', error)}
      >
        Buy Now - $599.99
      </TrustButton>
    </TrustJSProvider>
  )
}
```

---

## 📋 Features

- ✅ **Stripe Integration** - Secure payment processing
- ✅ **MFA Protection** - Multi-factor authentication for high-value transactions
- ✅ **Fraud Detection** - Real-time risk assessment
- ✅ **Blockchain Auditing** - Immutable transaction logging on Polygon
- ✅ **React Components** - Pre-built UI components
- ✅ **React Hooks** - `useTrustJS`, `usePayment`, `useMfa`
- ✅ **TypeScript Support** - Full type definitions
- ✅ **Customizable Themes** - Dark and light themes
- ✅ **Mobile Friendly** - Responsive design

---

## 📖 API Reference

### Constructor

```javascript
new TrustJS(config)
```

**Config Options:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `publishableKey` | string | ✅ | - | Your Stripe publishable key |
| `merchantId` | string | ✅ | - | Your merchant identifier |
| `apiUrl` | string | ❌ | `'https://api.trustjs.dev'` | Backend API URL |
| `environment` | string | ❌ | `'production'` | `'development'` or `'production'` |
| `theme` | string | ❌ | `'dark'` | `'dark'` or `'light'` |
| `mfaThreshold` | number | ❌ | `500` | Amount threshold for MFA |
| `enableBlockchain` | boolean | ❌ | `true` | Enable blockchain logging |
| `enableAnalytics` | boolean | ❌ | `true` | Enable analytics tracking |

---

### Methods

#### `createPayment(options)`

Create a new payment with automatic MFA detection.

```javascript
const payment = await trustjs.createPayment({
  amount: 599.99,
  orderId: 'order_123',
  currency: 'usd', // optional
  metadata: {} // optional
})
```

**Returns:** `Promise<PaymentResult>`

---

#### `verifyMfa(orderId, code)`

Verify MFA code for a payment.

```javascript
const result = await trustjs.verifyMfa('order_123', '123456')
```

**Returns:** `Promise<MfaResult>`

---

#### `confirmPayment(clientSecret, paymentMethodId)`

Confirm a Stripe payment.

```javascript
const paymentIntent = await trustjs.confirmPayment(
  clientSecret,
  paymentMethodId
)
```

**Returns:** `Promise<PaymentIntent>`

---

#### `getAnalytics(options)`

Get merchant analytics data.

```javascript
const analytics = await trustjs.getAnalytics({
  timeRange: '7d' // '24h', '7d', '30d'
})
```

**Returns:** `Promise<AnalyticsData>`

---

#### `getFraudPatterns(options)`

Get detected fraud patterns.

```javascript
const patterns = await trustjs.getFraudPatterns({
  timeRange: '24h'
})
```

**Returns:** `Promise<FraudPattern[]>`

---

#### `verifyBlockchain(transactionHash)`

Verify a blockchain transaction.

```javascript
const verification = await trustjs.verifyBlockchain('0x...')
```

**Returns:** `Promise<BlockchainVerification>`

---

## ⚛️ React Components

### TrustJSProvider

Wrap your app with the provider to enable React components and hooks.

```jsx
import { TrustJSProvider } from 'trust-mfa-sdk'

<TrustJSProvider
  publishableKey="pk_test_..."
  merchantId="your_merchant_id"
  apiUrl="https://api.trustjs.com"
  theme="dark"
  mfaThreshold={500}
>
  {children}
</TrustJSProvider>
```

---

### TrustButton

Pre-built payment button with MFA handling.

```jsx
import { TrustButton } from 'trust-mfa-sdk'

<TrustButton
  amount={599.99}
  orderId="order_123"
  onSuccess={(payment) => console.log(payment)}
  onError={(error) => console.error(error)}
  disabled={false}
  className="custom-class"
>
  Buy Now
</TrustButton>
```

---

### TrustForm

Complete payment form with card input.

```jsx
import { TrustForm } from 'trust-mfa-sdk'

<TrustForm
  amount={599.99}
  orderId="order_123"
  onSuccess={(payment) => console.log(payment)}
  onError={(error) => console.error(error)}
  showAmount={true}
  showOrderId={true}
/>
```

---

### TrustModal

Modal for MFA verification.

```jsx
import { TrustModal } from 'trust-mfa-sdk'

<TrustModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  orderId="order_123"
  onVerified={(result) => console.log(result)}
/>
```

---

## 🪝 React Hooks

### useTrustJS

Access the TrustJS instance from context.

```jsx
import { useTrustJS } from 'trust-mfa-sdk'

function MyComponent() {
  const trustjs = useTrustJS()
  
  const handlePayment = async () => {
    const payment = await trustjs.createPayment({
      amount: 599.99,
      orderId: 'order_123'
    })
  }
}
```

---

### usePayment

Hook for managing payment state.

```jsx
import { usePayment } from 'trust-mfa-sdk'

function CheckoutForm() {
  const {
    createPayment,
    confirmPayment,
    loading,
    error,
    payment
  } = usePayment()
  
  const handleSubmit = async () => {
    await createPayment({
      amount: 599.99,
      orderId: 'order_123'
    })
  }
}
```

---

### useMfa

Hook for MFA verification.

```jsx
import { useMfa } from 'trust-mfa-sdk'

function MfaForm() {
  const {
    verifyCode,
    resendCode,
    loading,
    error,
    verified
  } = useMfa('order_123')
  
  const handleVerify = async (code) => {
    await verifyCode(code)
  }
}
```

---

## 🎨 Theming

Customize the SDK appearance with CSS variables:

```css
:root {
  --trustjs-primary: #6c63ff;
  --trustjs-background: #1a1a2e;
  --trustjs-text: #f8f9ff;
  --trustjs-border: rgba(255, 255, 255, 0.15);
  --trustjs-error: #ef4444;
  --trustjs-success: #10b981;
}
```

Or use the built-in themes:

```javascript
const trustjs = new TrustJS({
  theme: 'light' // or 'dark'
})
```

---

## 🔒 Security

### Best Practices

1. **Never expose secret keys** - Only use publishable keys in client-side code
2. **Verify on backend** - Always verify payments on your server
3. **Use HTTPS** - All API calls must use HTTPS in production
4. **Store blockchain proofs** - Save transaction hashes for audit trails
5. **Implement rate limiting** - Prevent abuse of OTP requests

### MFA Threshold

Configure when MFA is required:

```javascript
const trustjs = new TrustJS({
  mfaThreshold: 500 // MFA required for amounts > $500
})
```

---

## 🧪 Testing

### Test Mode

Use Stripe test keys for development:

```javascript
const trustjs = new TrustJS({
  publishableKey: 'pk_test_...',
  environment: 'development'
})
```

### Test Cards

```
Card: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

---

## 📦 Build from Source

```bash
# Clone the repository
git clone https://github.com/Prashant-koi/Trust-is-the-only-way.git
cd Trust-is-the-only-way/sdk

# Install dependencies
npm install

# Build the SDK
npm run build

# Output will be in dist/ directory
```

---

## 🌐 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🤝 Support

- **Documentation**: https://docs.trustjs.com
- **GitHub Issues**: https://github.com/Prashant-koi/Trust-is-the-only-way/issues
- **Email**: support@trustjs.com

---

## 🙏 Acknowledgments

- Built with [Stripe](https://stripe.com)
- Powered by [Polygon](https://polygon.technology/)
- Bundled with [Rollup](https://rollupjs.org/)

---

<div align="center">

**TrustJS - Trust is the Only Way**

[Website](https://trustjs.com) • [Documentation](https://docs.trustjs.com) • [GitHub](https://github.com/Prashant-koi/Trust-is-the-only-way)

</div>
