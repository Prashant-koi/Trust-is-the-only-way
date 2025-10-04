# API Reference

## TrustJS Class

### Constructor

```javascript
new TrustJS(config)
```

**Parameters:**
- `config` (TrustJSConfig): Configuration object

**TrustJSConfig:**
```typescript
interface TrustJSConfig {
  publishableKey: string        // Required: Your publishable API key
  merchantId: string           // Required: Your merchant identifier
  apiUrl?: string              // Optional: API endpoint URL
  environment?: string         // Optional: 'development' | 'production'
  theme?: string              // Optional: 'dark' | 'light'
  mfaThreshold?: number       // Optional: Amount threshold for MFA
  enableBlockchain?: boolean  // Optional: Enable blockchain auditing
  enableAnalytics?: boolean   // Optional: Enable analytics
  timeout?: number           // Optional: Request timeout in ms
  retries?: number          // Optional: Number of retries
}
```

### Methods

#### `createPayment(options)`

Creates a new payment intent.

```javascript
const payment = await trustjs.createPayment({
  amount: 99.99,
  orderId: 'order_123',
  currency: 'usd',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe'
  }
})
```

**Parameters:**
- `options` (PaymentOptions): Payment configuration

**PaymentOptions:**
```typescript
interface PaymentOptions {
  amount: number | string      // Payment amount
  orderId: string             // Unique order identifier
  currency?: string           // Currency code (default: 'usd')
  customer?: CustomerInfo     // Customer information
}
```

**Returns:** `Promise<PaymentIntent>`

#### `verifyMfa(orderId, code)`

Verifies MFA code for a payment.

```javascript
const verification = await trustjs.verifyMfa('order_123', '123456')
```

**Parameters:**
- `orderId` (string): Order identifier
- `code` (string): 6-digit MFA code

**Returns:** `Promise<MfaVerification>`

#### `confirmPayment(clientSecret, paymentMethodId)`

Confirms a payment with Stripe.

```javascript
const result = await trustjs.confirmPayment(
  'pi_test_123_secret_abc',
  'pm_test_123'
)
```

**Returns:** `Promise<StripePaymentIntent>`

#### `getAnalytics(options?)`

Retrieves payment analytics data.

```javascript
const analytics = await trustjs.getAnalytics({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
})
```

**Returns:** `Promise<AnalyticsData>`

#### `getFraudPatterns(options?)`

Gets fraud detection patterns.

```javascript
const patterns = await trustjs.getFraudPatterns({
  merchantId: 'merchant_123',
  timeframe: '30d'
})
```

**Returns:** `Promise<FraudPattern[]>`

#### `verifyBlockchain(transactionHash)`

Verifies blockchain transaction.

```javascript
const verification = await trustjs.verifyBlockchain(
  '0x1234567890abcdef...'
)
```

**Returns:** `Promise<BlockchainVerification>`

### Events

#### `on(event, callback)`

Subscribes to an event.

```javascript
const unsubscribe = trustjs.on('payment:confirmed', (payment) => {
  console.log('Payment confirmed:', payment)
})

// Unsubscribe
unsubscribe()
```

**Available Events:**
- `payment:started` - Payment process started
- `payment:confirmed` - Payment confirmed successfully
- `payment:failed` - Payment failed
- `mfa:required` - MFA verification required
- `mfa:verified` - MFA successfully verified
- `mfa:failed` - MFA verification failed
- `error` - General error occurred

#### `emit(event, data?)`

Emits an event (internal use).

#### `off(event, callback)`

Unsubscribes from an event.

### Utility Methods

#### `getVersion()`

Returns the SDK version.

```javascript
const version = trustjs.getVersion() // "1.0.0"
```

#### `updateConfig(config)`

Updates configuration at runtime.

```javascript
trustjs.updateConfig({
  theme: 'light',
  mfaThreshold: 1000
})
```

#### `destroy()`

Cleans up resources and event listeners.

```javascript
trustjs.destroy()
```

## Error Classes

### TrustJSError

Base error class for all TrustJS errors.

```typescript
class TrustJSError extends Error {
  code?: string
  details?: any
  timestamp: string
}
```

### ValidationError

Thrown for validation failures.

```typescript
class ValidationError extends TrustJSError {
  field?: string
}
```

### PaymentError

Thrown for payment-related errors.

```typescript
class PaymentError extends TrustJSError {
  paymentIntentId?: string
}
```

### MfaError

Thrown for MFA-related errors.

```typescript
class MfaError extends TrustJSError {
  orderId?: string
}
```

## Type Definitions

See [types/index.d.ts](../types/index.d.ts) for complete TypeScript definitions.