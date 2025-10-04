# 🔐 TrustJS - Trust is the Only Way

**Blockchain-Powered MFA for Payment Security**

A modern, production-ready fraud detection system that combines multi-factor authentication with blockchain transparency. Built with React, Node.js, and Ethereum smart contracts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-blue)](https://reactjs.org/)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/trustjs/trust-is-the-only-way.git
cd trust-is-the-only-way

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Start the application
npm run dev
```

**Access the application:**
- 🛍️ **Demo Store**: http://localhost:3000
- 📊 **Analytics Portal**: http://localhost:3000/merchant
- 📚 **SDK Documentation**: http://localhost:3000/docs
- 🔌 **Backend API**: http://localhost:3001

---

## ✨ Features

### 🛡️ **Fraud Detection**
- **Smart Thresholds**: Automatic MFA for transactions over $500
- **Real-time Verification**: OTP-based authentication
- **Pattern Detection**: Identifies suspicious transaction patterns
- **Blockchain Audit Trail**: Immutable verification records

### 📊 **Analytics Dashboard**
- Transaction trends and revenue tracking
- Fraud attempt monitoring
- MFA success rate analytics
- Blockchain transaction explorer

### 🔌 **Developer SDK**
- Headless JavaScript SDK for easy integration
- TypeScript support with full type definitions
- React, Node.js, and vanilla JS examples
- Published on npm: `npm install trust-mfa-sdk`

### ⛓️ **Blockchain Integration**
- Polygon Amoy testnet deployment
- Immutable MFA verification logs
- Public transaction verification
- Zero PII storage on-chain

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TrustJS Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Demo Store │  │   Merchant   │  │     SDK      │      │
│  │   (React)    │  │   Portal     │  │     Docs     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Express API   │                        │
│                    │   (Node.js)    │                        │
│                    └───────┬────────┘                        │
│                            │                                 │
│              ┌─────────────┴─────────────┐                  │
│              │                           │                  │
│      ┌───────▼────────┐         ┌───────▼────────┐         │
│      │  Stripe API    │         │   Blockchain   │         │
│      │   (Payments)   │         │ (Polygon Amoy) │         │
│      └────────────────┘         └────────────────┘         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### **Tech Stack**

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Stripe Elements for payments
- Lucide React for icons

**Backend:**
- Node.js with Express
- Ethers.js for blockchain interaction
- Stripe for payment processing
- In-memory data store (demo)

**Blockchain:**
- Solidity smart contracts
- Polygon Amoy testnet
- Hardhat for deployment
- Alchemy RPC provider

---

## 📦 Project Structure

```
trust-is-the-only-way/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── analytics/      # Analytics components
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── StripePaymentForm.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── CustomerStore.jsx
│   │   │   ├── MerchantPortal.jsx
│   │   │   └── SdkDocs.jsx
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── sdk/                        # TrustJS SDK
│   ├── trust-mfa-sdk.js       # SDK implementation
│   ├── trust-mfa-sdk.d.ts     # TypeScript definitions
│   ├── package.json
│   ├── README.md
│   └── example.html           # Live demo
│
├── contracts/                  # Smart contracts
│   ├── MfaAudit.sol           # Main contract
│   └── hardhat.config.js
│
├── backend.js                  # Express API server
├── .env                        # Environment variables
└── package.json
```

---

## 🎮 How to Use

### **1. Demo Store (Customer Experience)**

Visit http://localhost:3000 to test the payment flow:

**Low-Value Transaction (No MFA):**
1. Add "Wireless Mouse" ($299) to cart
2. Proceed to checkout
3. Enter test card: `4242 4242 4242 4242`
4. Payment completes instantly ✅

**High-Value Transaction (MFA Required):**
1. Add "Premium Laptop" ($1,299) to cart
2. Proceed to checkout
3. Enter test card details
4. **MFA verification triggered** 🔐
5. Check alert for OTP code
6. Enter OTP to complete payment
7. View blockchain verification ⛓️

### **2. Merchant Portal (Analytics)**

Visit http://localhost:3000/merchant to view:
- Real-time transaction analytics
- Fraud detection patterns
- MFA success rates
- Blockchain verification records
- Revenue and transaction trends

### **3. SDK Integration**

Visit http://localhost:3000/docs for complete documentation.

**Quick Example:**
```javascript
import TrustMFA from 'trust-mfa-sdk';

const mfa = new TrustMFA({
  apiUrl: 'https://api.trustjs.com',
  merchantId: 'your_merchant_id',
  threshold: 500
});

const result = await mfa.requestMfa({
  orderId: 'order_123',
  amount: 599.99
}, {
  onVerificationRequired: async () => {
    return await promptUserForOtp();
  }
});

if (result.success && result.verified) {
  console.log('Blockchain proof:', result.blockchainTx);
}
```

---

## 🔧 Configuration

### **Environment Variables**

**Backend (.env):**
```bash
# Blockchain Configuration
ETHEREUM_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
ETHEREUM_PRIVATE_KEY=your_private_key
CHAIN_ID=80002
CONTRACT_ADDRESS=0x95493E1175Dc4966B6dCc865b6302e7B8704b319

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...

# Server Configuration
PORT=3001
```

**Frontend (frontend/.env):**
```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:3001

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🧪 Testing

### **Test Cards (Stripe)**
```
Card Number: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

### **MFA Threshold**
- Transactions **≤ $500**: No MFA required
- Transactions **> $500**: MFA verification required

### **OTP Codes**
- 6-digit codes displayed in browser alert
- Valid for 5 minutes
- Also logged in backend terminal

---

## 📊 Smart Contract

**Deployed on Polygon Amoy Testnet:**
- **Address**: `0x95493E1175Dc4966B6dCc865b6302e7B8704b319`
- **Explorer**: [View on PolygonScan](https://amoy.polygonscan.com/address/0x95493E1175Dc4966B6dCc865b6302e7B8704b319)

**Contract Functions:**
```solidity
// Log MFA verification on-chain
function logMfa(bytes32 approvalHash) external

// Event emitted for each verification
event MfaLogged(
    bytes32 indexed approvalHash,
    address indexed merchant,
    uint256 timestamp
)
```

**Approval Hash Generation:**
```javascript
keccak256(merchantId|orderId|timestamp|method|receiptId)
```

---

## 🚀 Deployment

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
# Build frontend
cd frontend && npm run build && cd ..

# Start production server
npm start
```

### **Deploy Smart Contract**
```bash
npx hardhat run scripts/deploy.js --network amoy
```

---

## 📚 SDK Documentation

The TrustJS SDK is available on npm:

```bash
npm install trust-mfa-sdk
```

**Features:**
- ✅ Headless integration
- ✅ TypeScript support
- ✅ React, Node.js, and vanilla JS examples
- ✅ Blockchain receipt verification
- ✅ Customizable UI callbacks

**Full documentation:** http://localhost:3000/docs

---

## 🔒 Security

### **Best Practices**
- ✅ OTP codes expire after 5 minutes
- ✅ One-way cryptographic hashes (keccak256)
- ✅ No PII stored on blockchain
- ✅ HTTPS for all API communications
- ✅ Rate limiting on OTP requests
- ✅ Stripe PCI compliance

### **Fraud Detection**
- Multiple failed MFA attempts
- High-value transaction patterns
- Rapid transaction detection
- Geographic anomaly detection

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Stripe** for payment processing
- **Polygon** for blockchain infrastructure
- **Alchemy** for RPC services
- **Hardhat** for smart contract development
- **Vite** for blazing fast builds

---

## 📞 Support

- **Documentation**: http://localhost:3000/docs
- **GitHub Issues**: https://github.com/trustjs/trust-is-the-only-way/issues
- **Email**: support@trustjs.com

---

## 🎯 Roadmap

- [ ] Multi-chain support (Ethereum, BSC, Arbitrum)
- [ ] SMS/Email OTP delivery
- [ ] Biometric authentication
- [ ] Advanced fraud ML models
- [ ] Mobile SDK (iOS/Android)
- [ ] Webhook notifications
- [ ] Multi-merchant support
- [ ] Custom branding options

---

<div align="center">

**TrustJS - Trust is the Only Way**

Built with ❤️ for secure payments

[Website](https://trustjs.com) • [Documentation](http://localhost:3000/docs) • [GitHub](https://github.com/trustjs/trust-is-the-only-way)

</div>
