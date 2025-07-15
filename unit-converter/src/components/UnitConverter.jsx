import { useState, useEffect, useMemo } from 'react'
import convert from 'convert'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

// Custom speed conversion function since convert library doesn't support speed units
const convertSpeed = (value, fromUnit, toUnit) => {
  // Convert everything to meters per second first, then to target unit
  const toMeterPerSecond = {
    'meters per second': 1,
    'kilometers per hour': 1 / 3.6,
    'miles per hour': 0.44704,
    'feet per second': 0.3048,
    'knots': 0.514444
  }

  const fromMeterPerSecond = {
    'meters per second': 1,
    'kilometers per hour': 3.6,
    'miles per hour': 2.23694,
    'feet per second': 3.28084,
    'knots': 1.94384
  }

  if (!toMeterPerSecond[fromUnit] || !fromMeterPerSecond[toUnit]) {
    throw new Error('Unsupported speed unit')
  }

  // Convert to m/s, then to target unit
  const meterPerSecond = value * toMeterPerSecond[fromUnit]
  return meterPerSecond * fromMeterPerSecond[toUnit]
}

const CONVERSION_CATEGORIES = {
  length: {
    name: 'Length',
    units: [
      { value: 'meters', label: 'Meters (m)', abbr: 'm' },
      { value: 'kilometers', label: 'Kilometers (km)', abbr: 'km' },
      { value: 'centimeters', label: 'Centimeters (cm)', abbr: 'cm' },
      { value: 'millimeters', label: 'Millimeters (mm)', abbr: 'mm' },
      { value: 'inches', label: 'Inches (in)', abbr: 'in' },
      { value: 'feet', label: 'Feet (ft)', abbr: 'ft' },
      { value: 'yards', label: 'Yards (yd)', abbr: 'yd' },
      { value: 'miles', label: 'Miles (mi)', abbr: 'mi' },
    ]
  },
  mass: {
    name: 'Weight/Mass',
    units: [
      { value: 'grams', label: 'Grams (g)', abbr: 'g' },
      { value: 'kilograms', label: 'Kilograms (kg)', abbr: 'kg' },
      { value: 'pounds', label: 'Pounds (lbs)', abbr: 'lbs' },
      { value: 'ounces', label: 'Ounces (oz)', abbr: 'oz' },
      { value: 'tonnes', label: 'Tonnes (t)', abbr: 't' },
      { value: 'stone', label: 'Stone (st)', abbr: 'st' },
    ]
  },
  temperature: {
    name: 'Temperature',
    units: [
      { value: 'celsius', label: 'Celsius (°C)', abbr: '°C' },
      { value: 'fahrenheit', label: 'Fahrenheit (°F)', abbr: '°F' },
      { value: 'kelvin', label: 'Kelvin (K)', abbr: 'K' },
    ]
  },
  volume: {
    name: 'Volume',
    units: [
      { value: 'liters', label: 'Liters (L)', abbr: 'L' },
      { value: 'milliliters', label: 'Milliliters (mL)', abbr: 'mL' },
      { value: 'gallons', label: 'Gallons (gal)', abbr: 'gal' },
      { value: 'quarts', label: 'Quarts (qt)', abbr: 'qt' },
      { value: 'pints', label: 'Pints (pt)', abbr: 'pt' },
      { value: 'cups', label: 'Cups (c)', abbr: 'c' },
      { value: 'cubic meters', label: 'Cubic Meters (m³)', abbr: 'm³' },
      { value: 'cubic feet', label: 'Cubic Feet (ft³)', abbr: 'ft³' },
    ]
  },
  area: {
    name: 'Area',
    units: [
      { value: 'square meters', label: 'Square Meters (m²)', abbr: 'm²' },
      { value: 'square kilometers', label: 'Square Kilometers (km²)', abbr: 'km²' },
      { value: 'square centimeters', label: 'Square Centimeters (cm²)', abbr: 'cm²' },
      { value: 'square feet', label: 'Square Feet (ft²)', abbr: 'ft²' },
      { value: 'square inches', label: 'Square Inches (in²)', abbr: 'in²' },
      { value: 'acres', label: 'Acres (ac)', abbr: 'ac' },
      { value: 'hectares', label: 'Hectares (ha)', abbr: 'ha' },
    ]
  },
  energy: {
    name: 'Energy',
    units: [
      { value: 'joules', label: 'Joules (J)', abbr: 'J' },
      { value: 'kilojoules', label: 'Kilojoules (kJ)', abbr: 'kJ' },
      { value: 'calories', label: 'Calories (cal)', abbr: 'cal' },
      { value: 'kilocalories', label: 'Kilocalories (kcal)', abbr: 'kcal' },
      { value: 'watt hours', label: 'Watt Hours (Wh)', abbr: 'Wh' },
      { value: 'kilowatt hours', label: 'Kilowatt Hours (kWh)', abbr: 'kWh' },
    ]
  },
  pressure: {
    name: 'Pressure',
    units: [
      { value: 'pascals', label: 'Pascals (Pa)', abbr: 'Pa' },
      { value: 'kilopascals', label: 'Kilopascals (kPa)', abbr: 'kPa' },
      { value: 'bars', label: 'Bars (bar)', abbr: 'bar' },
      { value: 'atmospheres', label: 'Atmospheres (atm)', abbr: 'atm' },
      { value: 'pounds per square inch', label: 'PSI (psi)', abbr: 'psi' },
      { value: 'torrs', label: 'Torr (Torr)', abbr: 'Torr' },
    ]
  },
  speed: {
    name: 'Speed',
    units: [
      { value: 'meters per second', label: 'Meters/Second (m/s)', abbr: 'm/s' },
      { value: 'kilometers per hour', label: 'Kilometers/Hour (km/h)', abbr: 'km/h' },
      { value: 'miles per hour', label: 'Miles/Hour (mph)', abbr: 'mph' },
      { value: 'feet per second', label: 'Feet/Second (ft/s)', abbr: 'ft/s' },
      { value: 'knots', label: 'Knots (kn)', abbr: 'kn' },
    ]
  },
  power: {
    name: 'Power',
    units: [
      { value: 'watts', label: 'Watts (W)', abbr: 'W' },
      { value: 'kilowatts', label: 'Kilowatts (kW)', abbr: 'kW' },
      { value: 'megawatts', label: 'Megawatts (MW)', abbr: 'MW' },
      { value: 'horsepower', label: 'Horsepower (hp)', abbr: 'hp' },
    ]
  },
  digital: {
    name: 'Data Storage',
    units: [
      { value: 'bytes', label: 'Bytes (B)', abbr: 'B' },
      { value: 'kilobytes', label: 'Kilobytes (KB)', abbr: 'KB' },
      { value: 'megabytes', label: 'Megabytes (MB)', abbr: 'MB' },
      { value: 'gigabytes', label: 'Gigabytes (GB)', abbr: 'GB' },
      { value: 'terabytes', label: 'Terabytes (TB)', abbr: 'TB' },
      { value: 'bits', label: 'Bits (bit)', abbr: 'bit' },
      { value: 'kilobits', label: 'Kilobits (Kb)', abbr: 'Kb' },
      { value: 'megabits', label: 'Megabits (Mb)', abbr: 'Mb' },
      { value: 'gigabits', label: 'Gigabits (Gb)', abbr: 'Gb' },
    ]
  }
}

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState('length')
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState('meters')
  const [toUnit, setToUnit] = useState('feet')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const currentUnits = useMemo(() => {
    return CONVERSION_CATEGORIES[selectedCategory]?.units || []
  }, [selectedCategory])

  // Update default units when category changes
  useEffect(() => {
    const units = CONVERSION_CATEGORIES[selectedCategory]?.units || []
    if (units.length >= 2) {
      if (selectedCategory === 'length') {
        setFromUnit('meters')
        setToUnit('feet')
      } else {
        setFromUnit(units[0].value)
        setToUnit(units[1].value)
      }
    }
    setResult('')
    setError('')
  }, [selectedCategory])

  // Perform conversion in real-time
  useEffect(() => {
    if (inputValue && !isNaN(inputValue) && inputValue !== '') {
      try {
        const numValue = parseFloat(inputValue)
        if (numValue === 0) {
          setResult('0')
          setError('')
          return
        }

        let convertedValue

        // Use custom speed conversion for speed category
        if (selectedCategory === 'speed') {
          convertedValue = convertSpeed(numValue, fromUnit, toUnit)
        } else {
          // Use the convert library for other categories
          convertedValue = convert(numValue, fromUnit).to(toUnit)
        }

        // Format the result appropriately
        let formattedResult
        if (convertedValue < 0.001 && convertedValue > 0) {
          formattedResult = convertedValue.toExponential(3)
        } else if (convertedValue > 1000000) {
          formattedResult = convertedValue.toExponential(3)
        } else {
          formattedResult = parseFloat(convertedValue.toFixed(6)).toString()
        }

        setResult(formattedResult)
        setError('')
      } catch (err) {
        setError('Conversion not possible between these units')
        setResult('')
      }
    } else {
      setResult('')
      setError('')
    }
  }, [inputValue, fromUnit, toUnit])

  const handleSwapUnits = () => {
    const tempUnit = fromUnit
    setFromUnit(toUnit)
    setToUnit(tempUnit)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setInputValue(value)
    }
  }

  return (
    <div className="space-y-8">
      {/* Category Selection */}
      <div className="converter-card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Select Conversion Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(CONVERSION_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedCategory === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Interface */}
      <div className="converter-card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {CONVERSION_CATEGORIES[selectedCategory]?.name} Converter
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          {/* From Unit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter value"
              className="input-field"
              autoFocus
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="select-field"
            >
              {currentUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapUnits}
              className="btn-secondary p-3 rounded-full"
              title="Swap units"
            >
              <ArrowsRightLeftIcon className="w-5 h-5" />
            </button>
          </div>

          {/* To Unit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <div className="input-field bg-gray-50 dark:bg-gray-800 min-h-[48px] flex items-center">
              {result ? (
                <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {result}
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">Result will appear here</span>
              )}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="select-field"
            >
              {currentUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Result Summary */}
        {result && inputValue && !error && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 text-center">
              <span className="font-semibold">{inputValue}</span>{' '}
              {currentUnits.find(u => u.value === fromUnit)?.abbr} = {' '}
              <span className="font-semibold">{result}</span>{' '}
              {currentUnits.find(u => u.value === toUnit)?.abbr}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnitConverter
