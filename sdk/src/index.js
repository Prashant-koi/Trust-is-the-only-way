// Core SDK
export { default as TrustJS } from './core/TrustJS.js'
export * from './utils/errors.js'

// React Components
export {
  TrustJSProvider,
  TrustButton,
  TrustForm,
  TrustFormWrapper,
  TrustModal
} from './components/index.js'

// React Hooks
export {
  useTrustJS,
  usePayment,
  useMfa
} from './hooks/index.js'

// CSS import (for bundlers)
import './styles/trustjs.css'

// Default export
export { default } from './core/TrustJS.js'