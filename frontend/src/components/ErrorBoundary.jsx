import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Merchant Portal Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <div className="error-state">
            <h2>🚨 Merchant Portal Error</h2>
            <p>The merchant portal encountered an error. This is likely due to missing dependencies.</p>
            <details>
              <summary>Error Details</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
            <div className="error-actions">
              <button 
                onClick={() => this.setState({ hasError: false, error: null })}
                className="retry-btn"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="home-btn"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary