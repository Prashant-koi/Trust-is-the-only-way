export const TRUSTJS_VERSION = '1.0.0'

export const DEFAULT_CONFIG = {
  apiUrl: 'http://localhost:3001',
  environment: 'development',
  theme: 'dark',
  mfaThreshold: 500,
  enableBlockchain: true,
  enableAnalytics: true,
  timeout: 30000,
  retries: 3
}

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
}

export const PAYMENT_METHODS = {
  CARD: 'card'
}

export const MFA_METHODS = {
  OTP: 'otp'
}

export const EVENT_TYPES = {
  PAYMENT_STARTED: 'payment:started',
  PAYMENT_CREATED: 'payment:created',
  PAYMENT_CONFIRMED: 'payment:confirmed',
  PAYMENT_ERROR: 'payment:error',
  MFA_STARTED: 'mfa:started',
  MFA_VERIFIED: 'mfa:verified',
  MFA_ERROR: 'mfa:error',
  CONFIG_UPDATED: 'config:updated',
  DESTROYED: 'destroyed'
}