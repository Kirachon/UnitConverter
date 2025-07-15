import { useState, useEffect } from 'react'
import convert from 'convert'
import UnitConverter from './components/UnitConverter'
import CurrencyConverter from './components/CurrencyConverter'
import QuickConversions from './components/QuickConversions'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import Header from './components/Header'
import Footer from './components/Footer'
import ThemeProvider from './components/ThemeProvider'


function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Universal Unit Converter
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Convert between different units instantly. Support for weight, length, temperature,
                volume, area, energy, pressure, speed, power, and data storage units.
              </p>
            </div>

            <div className="space-y-8">
              <UnitConverter />
              <CurrencyConverter />
              <QuickConversions />
            </div>
          </div>
        </main>
        <Footer />
        <KeyboardShortcuts />

      </div>
    </ThemeProvider>
  )
}

export default App
