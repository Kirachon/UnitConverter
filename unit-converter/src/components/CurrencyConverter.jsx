import { useState, useEffect, useMemo } from 'react'
import { ArrowsRightLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

// Popular currencies for the converter
const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
]

const CurrencyConverter = () => {
  const [inputValue, setInputValue] = useState('')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState('')
  const [exchangeRates, setExchangeRates] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  // Mock exchange rates for demo (in production, this would come from an API)
  const mockExchangeRates = {
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

  // Simulate API call to fetch exchange rates
  const fetchExchangeRates = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In production, this would be:
      // const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`)
      // const data = await response.json()
      // setExchangeRates(data.rates)
      
      setExchangeRates(mockExchangeRates)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to fetch exchange rates. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch rates on component mount
  useEffect(() => {
    fetchExchangeRates()
  }, [])

  // Perform currency conversion
  useEffect(() => {
    if (inputValue && !isNaN(inputValue) && inputValue !== '' && exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const numValue = parseFloat(inputValue)
      if (numValue === 0) {
        setResult('0')
        return
      }
      
      // Convert from base currency (USD) to target currency
      const usdAmount = numValue / exchangeRates[fromCurrency]
      const convertedAmount = usdAmount * exchangeRates[toCurrency]
      
      // Format the result
      const formattedResult = convertedAmount.toFixed(2)
      setResult(formattedResult)
    } else {
      setResult('')
    }
  }, [inputValue, fromCurrency, toCurrency, exchangeRates])

  const handleSwapCurrencies = () => {
    const tempCurrency = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tempCurrency)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInputValue(value)
    }
  }

  const getExchangeRate = () => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]
      return rate.toFixed(4)
    }
    return null
  }

  return (
    <div className="converter-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Currency Converter
        </h2>
        <button
          onClick={fetchExchangeRates}
          disabled={loading}
          className="btn-secondary text-sm py-2 px-4"
        >
          {loading ? 'Updating...' : 'Refresh Rates'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
        {/* From Currency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            From
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="input-field"
            autoFocus
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="select-field"
          >
            {POPULAR_CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapCurrencies}
            className="btn-secondary p-3 rounded-full"
            title="Swap currencies"
          >
            <ArrowsRightLeftIcon className="w-5 h-5" />
          </button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            To
          </label>
          <div className="input-field bg-gray-50 dark:bg-gray-800 min-h-[48px] flex items-center">
            {result ? (
              <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {POPULAR_CURRENCIES.find(c => c.code === toCurrency)?.symbol}{result}
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">Result will appear here</span>
            )}
          </div>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="select-field"
          >
            {POPULAR_CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exchange Rate Info */}
      {getExchangeRate() && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-sm text-center">
            1 {fromCurrency} = {getExchangeRate()} {toCurrency}
          </p>
          {lastUpdated && (
            <p className="text-blue-600 dark:text-blue-400 text-xs text-center mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      {/* Result Summary */}
      {result && inputValue && !error && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-center">
            <span className="font-semibold">{POPULAR_CURRENCIES.find(c => c.code === fromCurrency)?.symbol}{inputValue}</span>{' '}
            {fromCurrency} = {' '}
            <span className="font-semibold">{POPULAR_CURRENCIES.find(c => c.code === toCurrency)?.symbol}{result}</span>{' '}
            {toCurrency}
          </p>
        </div>
      )}

      {/* Demo Notice */}
      <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200 text-xs text-center">
          <strong>Demo Mode:</strong> Using mock exchange rates. In production, this would use real-time data from OpenExchangeRates API.
        </p>
      </div>
    </div>
  )
}

export default CurrencyConverter
