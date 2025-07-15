import convert from 'convert'

describe('Unit Conversion Tests', () => {
  describe('Length Conversions', () => {
    test('converts 1 meter to feet', () => {
      const result = convert(1, 'meters').to('feet')
      expect(result).toBeCloseTo(3.28084, 5)
    })

    test('converts 1 kilometer to miles', () => {
      const result = convert(1, 'kilometers').to('miles')
      expect(result).toBeCloseTo(0.621371, 5)
    })

    test('converts 1 inch to centimeters', () => {
      const result = convert(1, 'inches').to('centimeters')
      expect(result).toBeCloseTo(2.54, 5)
    })

    test('converts 100 centimeters to meters', () => {
      const result = convert(100, 'centimeters').to('meters')
      expect(result).toBeCloseTo(1, 5)
    })
  })

  describe('Mass Conversions', () => {
    test('converts 1 kilogram to pounds', () => {
      const result = convert(1, 'kilograms').to('pounds')
      expect(result).toBeCloseTo(2.20462, 5)
    })

    test('converts 1 pound to kilograms', () => {
      const result = convert(1, 'pounds').to('kilograms')
      expect(result).toBeCloseTo(0.453592, 5)
    })

    test('converts 1 ounce to grams', () => {
      const result = convert(1, 'ounces').to('grams')
      expect(result).toBeCloseTo(28.3495, 4)
    })

    test('converts 1000 grams to kilograms', () => {
      const result = convert(1000, 'grams').to('kilograms')
      expect(result).toBeCloseTo(1, 5)
    })
  })

  describe('Temperature Conversions', () => {
    test('converts 0°C to Fahrenheit', () => {
      const result = convert(0, 'celsius').to('fahrenheit')
      expect(result).toBeCloseTo(32, 5)
    })

    test('converts 32°F to Celsius', () => {
      const result = convert(32, 'fahrenheit').to('celsius')
      expect(result).toBeCloseTo(0, 5)
    })

    test('converts 100°C to Fahrenheit', () => {
      const result = convert(100, 'celsius').to('fahrenheit')
      expect(result).toBeCloseTo(212, 5)
    })

    test('converts 273.15K to Celsius', () => {
      const result = convert(273.15, 'kelvin').to('celsius')
      expect(result).toBeCloseTo(0, 2)
    })
  })

  describe('Volume Conversions', () => {
    test('converts 1 liter to gallons', () => {
      const result = convert(1, 'liters').to('gallons')
      expect(result).toBeCloseTo(0.264172, 5)
    })

    test('converts 1 gallon to liters', () => {
      const result = convert(1, 'gallons').to('liters')
      expect(result).toBeCloseTo(3.78541, 5)
    })

    test('converts 1 cup to milliliters', () => {
      const result = convert(1, 'cups').to('milliliters')
      expect(result).toBeCloseTo(236.588, 3)
    })
  })

  describe('Power Conversions', () => {
    test('converts 1 kilowatt to watts', () => {
      const result = convert(1, 'kilowatts').to('watts')
      expect(result).toBeCloseTo(1000, 5)
    })

    test('converts 1 horsepower to watts', () => {
      const result = convert(1, 'horsepower').to('watts')
      expect(result).toBeCloseTo(745.7, 1)
    })
  })

  describe('Digital Storage Conversions', () => {
    test('converts 1 kilobyte to bytes', () => {
      const result = convert(1, 'kilobytes').to('bytes')
      expect(result).toBeCloseTo(1000, 5)
    })

    test('converts 1 megabyte to kilobytes', () => {
      const result = convert(1, 'megabytes').to('kilobytes')
      expect(result).toBeCloseTo(1000, 5)
    })

    test('converts 1 gigabyte to megabytes', () => {
      const result = convert(1, 'gigabytes').to('megabytes')
      expect(result).toBeCloseTo(1000, 5)
    })
  })

  describe('Edge Cases', () => {
    test('handles zero values', () => {
      const result = convert(0, 'meters').to('feet')
      expect(result).toBe(0)
    })

    test('handles negative values for temperature', () => {
      const result = convert(-40, 'celsius').to('fahrenheit')
      expect(result).toBeCloseTo(-40, 5)
    })

    test('handles large numbers', () => {
      const result = convert(1000000, 'meters').to('kilometers')
      expect(result).toBeCloseTo(1000, 5)
    })

    test('handles decimal values', () => {
      const result = convert(2.5, 'kilograms').to('pounds')
      expect(result).toBeCloseTo(5.51155, 4)
    })
  })
})
