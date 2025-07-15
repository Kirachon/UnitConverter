/**
 * Currency Service for OpenExchangeRates API Integration
 * Handles real-time exchange rate fetching with caching and error handling
 */

class CurrencyService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENEXCHANGE_API_KEY
    this.baseURL = 'https://openexchangerates.org/api'
    this.cache = new Map()
    this.cacheTimeout = 30 * 60 * 1000 // 30 minutes
    this.lastRequest = 0
    this.minInterval = 60000 // 1 minute between requests (rate limiting)
    
    // Fallback rates in case API fails
    this.fallbackRates = {
      USD: 1.0,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
      BRL: 5.2,
      RUB: 75.0,
      KRW: 1180.0,
      MXN: 20.0,
      SGD: 1.35,
      NZD: 1.42,
    }
  }

  /**
   * Get latest exchange rates with caching
   * @returns {Promise<Object>} Exchange rates data
   */
  async getLatestRates() {
    const cacheKey = 'latest_rates'
    const cached = this.cache.get(cacheKey)
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('Using cached exchange rates')
      return {
        rates: cached.data.rates,
        timestamp: cached.timestamp,
        source: 'cache'
      }
    }

    // Check localStorage for persistent cache
    const localCache = this.getLocalStorageCache()
    if (localCache && Date.now() - localCache.timestamp < this.cacheTimeout) {
      console.log('Using localStorage cached exchange rates')
      this.cache.set(cacheKey, localCache)
      return {
        rates: localCache.data.rates,
        timestamp: localCache.timestamp,
        source: 'localStorage'
      }
    }

    // Rate limiting check
    const now = Date.now()
    if (now - this.lastRequest < this.minInterval) {
      console.warn('Rate limit: Using cached or fallback data')
      return this.getFallbackResponse()
    }

    try {
      console.log('Fetching fresh exchange rates from API')
      this.lastRequest = now
      
      const response = await fetch(`${this.baseURL}/latest.json?app_id=${this.apiKey}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Validate response structure
      if (!data.rates || typeof data.rates !== 'object') {
        throw new Error('Invalid API response structure')
      }

      const cacheData = {
        data,
        timestamp: now
      }

      // Cache in memory
      this.cache.set(cacheKey, cacheData)
      
      // Cache in localStorage for persistence
      this.setLocalStorageCache(cacheData)

      return {
        rates: data.rates,
        timestamp: now,
        source: 'api'
      }

    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      
      // Try to return cached data even if expired
      if (cached) {
        console.log('Using expired cache due to API error')
        return {
          rates: cached.data.rates,
          timestamp: cached.timestamp,
          source: 'expired_cache',
          error: error.message
        }
      }

      // Return fallback data as last resort
      console.log('Using fallback exchange rates')
      return this.getFallbackResponse(error.message)
    }
  }

  /**
   * Get fallback response when API fails
   * @param {string} errorMessage - Optional error message
   * @returns {Object} Fallback response
   */
  getFallbackResponse(errorMessage = null) {
    return {
      rates: this.fallbackRates,
      timestamp: Date.now(),
      source: 'fallback',
      error: errorMessage
    }
  }

  /**
   * Get cached data from localStorage
   * @returns {Object|null} Cached data or null
   */
  getLocalStorageCache() {
    try {
      const cached = localStorage.getItem('currency_rates_cache')
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (error) {
      console.warn('Failed to read localStorage cache:', error)
    }
    return null
  }

  /**
   * Save data to localStorage cache
   * @param {Object} data - Data to cache
   */
  setLocalStorageCache(data) {
    try {
      localStorage.setItem('currency_rates_cache', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage cache:', error)
    }
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear()
    try {
      localStorage.removeItem('currency_rates_cache')
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error)
    }
  }

  /**
   * Get API usage info (for monitoring)
   * @returns {Object} Usage information
   */
  getUsageInfo() {
    return {
      lastRequest: this.lastRequest,
      cacheSize: this.cache.size,
      hasLocalStorage: !!this.getLocalStorageCache(),
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'Not configured'
    }
  }
}

// Export singleton instance
export default new CurrencyService()
