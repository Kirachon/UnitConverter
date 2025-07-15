import { useState, useEffect } from 'react'
import { CommandLineIcon, XMarkIcon } from '@heroicons/react/24/outline'

const SHORTCUTS = [
  { key: 'Tab', description: 'Navigate between form elements' },
  { key: 'Enter', description: 'Activate buttons and links' },
  { key: 'Space', description: 'Toggle buttons and checkboxes' },
  { key: 'Escape', description: 'Close modals and dropdowns' },
  { key: 'Ctrl + D', description: 'Toggle dark/light mode' },
  { key: 'Ctrl + R', description: 'Refresh currency rates' },
  { key: 'Ctrl + S', description: 'Swap units (when input is focused)' },
]

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Toggle shortcuts modal with Ctrl + ?
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault()
        setIsOpen(!isOpen)
      }
      
      // Close modal with Escape
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        title="Keyboard shortcuts (Ctrl + /)"
        aria-label="Show keyboard shortcuts"
      >
        <CommandLineIcon className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label="Close shortcuts modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {SHORTCUTS.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {shortcut.description}
                </span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-mono rounded border border-gray-300 dark:border-gray-600">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-xs text-center">
              Press <kbd className="px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded text-xs">Ctrl + /</kbd> to toggle this help
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcuts
