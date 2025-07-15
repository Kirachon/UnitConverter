import { useState } from 'react'
import convert from 'convert'

const QUICK_CONVERSIONS = [
  {
    category: 'Popular Length',
    conversions: [
      { from: 1, fromUnit: 'meters', toUnit: 'feet', label: '1 meter to feet' },
      { from: 1, fromUnit: 'kilometers', toUnit: 'miles', label: '1 km to miles' },
      { from: 1, fromUnit: 'inches', toUnit: 'centimeters', label: '1 inch to cm' },
      { from: 1, fromUnit: 'feet', toUnit: 'meters', label: '1 foot to meters' },
    ]
  },
  {
    category: 'Popular Weight',
    conversions: [
      { from: 1, fromUnit: 'kilograms', toUnit: 'pounds', label: '1 kg to lbs' },
      { from: 1, fromUnit: 'pounds', toUnit: 'kilograms', label: '1 lb to kg' },
      { from: 1, fromUnit: 'ounces', toUnit: 'grams', label: '1 oz to grams' },
      { from: 1, fromUnit: 'stone', toUnit: 'kilograms', label: '1 stone to kg' },
    ]
  },
  {
    category: 'Popular Temperature',
    conversions: [
      { from: 0, fromUnit: 'celsius', toUnit: 'fahrenheit', label: '0°C to °F' },
      { from: 32, fromUnit: 'fahrenheit', toUnit: 'celsius', label: '32°F to °C' },
      { from: 100, fromUnit: 'celsius', toUnit: 'fahrenheit', label: '100°C to °F' },
      { from: 273.15, fromUnit: 'kelvin', toUnit: 'celsius', label: '273.15K to °C' },
    ]
  },
  {
    category: 'Popular Volume',
    conversions: [
      { from: 1, fromUnit: 'liters', toUnit: 'gallons', label: '1 liter to gallons' },
      { from: 1, fromUnit: 'gallons', toUnit: 'liters', label: '1 gallon to liters' },
      { from: 1, fromUnit: 'cups', toUnit: 'milliliters', label: '1 cup to mL' },
      { from: 1, fromUnit: 'pints', toUnit: 'liters', label: '1 pint to liters' },
    ]
  }
]

const QuickConversions = () => {
  const [results, setResults] = useState({})

  const calculateConversion = (conversion) => {
    try {
      const result = convert(conversion.from, conversion.fromUnit).to(conversion.toUnit)
      return parseFloat(result.toFixed(4))
    } catch (error) {
      return 'Error'
    }
  }

  return (
    <div className="converter-card">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Quick Reference Conversions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUICK_CONVERSIONS.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.conversions.map((conversion, conversionIndex) => {
                const result = calculateConversion(conversion)
                return (
                  <div
                    key={conversionIndex}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {conversion.label}
                    </span>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {result}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200 text-sm text-center">
          💡 <strong>Tip:</strong> Use the converter above for custom values and more unit options!
        </p>
      </div>
    </div>
  )
}

export default QuickConversions
