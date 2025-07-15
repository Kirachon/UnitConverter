import { useState } from 'react'
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTheme } from './ThemeProvider'

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                UnitConverter
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Bars3Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
