import { TrustJSError } from '../utils/errors.js'

export default class ApiClient {
  constructor(config) {
    this.config = config
    this.baseURL = config.apiUrl
    this.timeout = config.timeout || 30000
    this.retries = config.retries || 3
  }

  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TrustJS/1.0.0',
        ...options.headers
      },
      ...options
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    let lastError
    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        console.log(`🔍 ApiClient: ${method} ${url} (attempt ${attempt}/${this.retries})`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)
        
        config.signal = controller.signal

        const response = await fetch(url, config)
        clearTimeout(timeoutId)

        console.log(`🔍 ApiClient: Response ${response.status}`)

        if (!response.ok) {
          const errorText = await response.text()
          throw new TrustJSError(`HTTP ${response.status}: ${errorText}`)
        }

        const result = await response.json()
        console.log('🔍 ApiClient: Success', result)
        return result

      } catch (error) {
        lastError = error
        console.error(`🔍 ApiClient: Attempt ${attempt} failed`, error.message)

        if (attempt === this.retries) {
          break
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw new TrustJSError(`API request failed after ${this.retries} attempts: ${lastError.message}`)
  }

  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString()
    const url = query ? `${endpoint}?${query}` : endpoint
    return this.request('GET', url)
  }

  async post(endpoint, data) {
    return this.request('POST', endpoint, data)
  }

  async put(endpoint, data) {
    return this.request('PUT', endpoint, data)
  }

  async delete(endpoint) {
    return this.request('DELETE', endpoint)
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    this.baseURL = this.config.apiUrl
  }

  destroy() {
    // Cleanup any pending requests
    console.log('🔍 ApiClient: Destroyed')
  }
}