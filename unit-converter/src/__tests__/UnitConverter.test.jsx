import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UnitConverter from '../components/UnitConverter'

// Mock the convert library
jest.mock('convert', () => ({
  __esModule: true,
  default: jest.fn((value, fromUnit) => ({
    to: jest.fn((toUnit) => {
      // Mock some basic conversions for testing
      if (fromUnit === 'meters' && toUnit === 'feet') {
        return value * 3.28084
      }
      if (fromUnit === 'kilograms' && toUnit === 'pounds') {
        return value * 2.20462
      }
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        return (value * 9/5) + 32
      }
      return value // Default case
    })
  }))
}))

describe('UnitConverter Component', () => {
  beforeEach(() => {
    render(<UnitConverter />)
  })

  test('renders unit converter with default category', () => {
    expect(screen.getByText('Select Conversion Type')).toBeInTheDocument()
    expect(screen.getByText('Length Converter')).toBeInTheDocument()
  })

  test('displays all conversion categories', () => {
    expect(screen.getByText('Length')).toBeInTheDocument()
    expect(screen.getByText('Weight/Mass')).toBeInTheDocument()
    expect(screen.getByText('Temperature')).toBeInTheDocument()
    expect(screen.getByText('Volume')).toBeInTheDocument()
    expect(screen.getByText('Area')).toBeInTheDocument()
    expect(screen.getByText('Energy')).toBeInTheDocument()
    expect(screen.getByText('Pressure')).toBeInTheDocument()
    expect(screen.getByText('Speed')).toBeInTheDocument()
    expect(screen.getByText('Power')).toBeInTheDocument()
    expect(screen.getByText('Data Storage')).toBeInTheDocument()
  })

  test('switches between conversion categories', async () => {
    const user = userEvent.setup()
    
    // Click on Weight/Mass category
    await user.click(screen.getByText('Weight/Mass'))
    
    expect(screen.getByText('Weight/Mass Converter')).toBeInTheDocument()
  })

  test('performs real-time conversion', async () => {
    const user = userEvent.setup()
    
    // Find the input field and enter a value
    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, '10')
    
    // Wait for the conversion to appear
    await waitFor(() => {
      expect(screen.getAllByText('32.8084')[0]).toBeInTheDocument()
    })
  })

  test('swaps units when swap button is clicked', async () => {
    const user = userEvent.setup()
    
    // Get initial from and to selects
    const fromSelect = screen.getAllByRole('combobox')[0]
    const toSelect = screen.getAllByRole('combobox')[1]
    
    // Check initial values
    expect(fromSelect.value).toBe('meters')
    expect(toSelect.value).toBe('feet')
    
    // Click swap button
    const swapButton = screen.getByTitle('Swap units')
    await user.click(swapButton)
    
    // Check that values are swapped
    expect(fromSelect.value).toBe('feet')
    expect(toSelect.value).toBe('meters')
  })

  test('handles invalid input gracefully', async () => {
    const user = userEvent.setup()
    
    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, 'abc')
    
    // Input should remain empty or not accept invalid characters
    expect(input.value).toBe('')
  })

  test('displays result summary when conversion is performed', async () => {
    const user = userEvent.setup()
    
    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, '5')
    
    await waitFor(() => {
      // Check for the summary text with more specific matching
      expect(screen.getAllByText((content, element) => {
        return element?.textContent?.includes('5') &&
               element?.textContent?.includes('m') &&
               element?.textContent?.includes('=') &&
               element?.textContent?.includes('16.4042') &&
               element?.textContent?.includes('ft')
      })[0]).toBeInTheDocument()
    })
  })

  test('clears result when input is cleared', async () => {
    const user = userEvent.setup()
    
    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, '10')
    
    // Wait for result to appear
    await waitFor(() => {
      expect(screen.getAllByText('32.8084')[0]).toBeInTheDocument()
    })
    
    // Clear input
    await user.clear(input)
    
    // Result should be cleared
    await waitFor(() => {
      expect(screen.getByText('Result will appear here')).toBeInTheDocument()
    })
  })

  test('handles zero input correctly', async () => {
    const user = userEvent.setup()
    
    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, '0')
    
    await waitFor(() => {
      expect(screen.getAllByText('0')[0]).toBeInTheDocument()
    })
  })

  test('updates units when category changes', async () => {
    const user = userEvent.setup()
    
    // Switch to temperature category
    await user.click(screen.getByText('Temperature'))
    
    // Check that temperature units are now available
    expect(screen.getByText('Temperature Converter')).toBeInTheDocument()
    
    const fromSelect = screen.getAllByRole('combobox')[0]
    expect(fromSelect.value).toBe('celsius')
  })
})
