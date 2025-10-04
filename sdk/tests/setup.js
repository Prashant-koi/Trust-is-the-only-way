import '@testing-library/jest-dom'

// Mock Stripe
global.Stripe = {
  loadStripe: jest.fn(() => Promise.resolve({
    createPaymentMethod: jest.fn(),
    confirmCardPayment: jest.fn(),
    elements: jest.fn(() => ({
      create: jest.fn(),
      getElement: jest.fn()
    }))
  }))
}

// Mock fetch
global.fetch = jest.fn()

// Console suppression for tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})