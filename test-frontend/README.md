# 🔒 TrustJS SDK Test Frontend

A professional Vite + React development environment for testing the TrustJS payment SDK.

## 🚀 Quick Start

```bash
# Navigate to test frontend
cd test-frontend

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

## 🎯 What This Tests

### 🔗 **Live Development Environment**
- **Hot Reload**: Changes to SDK reflect instantly
- **React Dev Tools**: Full debugging capabilities  
- **Vite Fast Refresh**: Sub-second updates
- **Source Maps**: Debug original TypeScript/JSX

### 🧪 **SDK Component Testing**

1. **TrustButton Variants**:
   - Standard button ($99.99 - no MFA)
   - Modal button ($999.99 - requires MFA)
   - Inline form variant

2. **Direct Components**:
   - TrustForm component usage
   - Event handling testing
   - Error state testing

3. **Integration Testing**:
   - Backend connectivity
   - Real-time activity logging
   - Payment flow validation

This test environment provides a professional development experience for validating the TrustJS SDK! 🎯

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
