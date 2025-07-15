import { useState, useEffect } from 'react'
import { 
  CogIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('content')
  const [isVisible, setIsVisible] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Content Management State
  const [content, setContent] = useState({
    aboutUs: 'The most comprehensive and user-friendly unit converter on the web. Convert between different units instantly with precision and ease.',
    features: [
      'Real-time unit conversions',
      'Support for 10+ unit categories',
      'Dark/Light theme toggle',
      'Keyboard shortcuts',
      'Mobile responsive design'
    ],
    contact: {
      email: 'support@unitconverter.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Digital City, DC 12345'
    },
    footer: {
      companyName: 'Universal Unit Converter',
      copyright: '© 2024 Universal Unit Converter. All rights reserved.',
      socialLinks: {
        github: '#',
        twitter: '#'
      }
    }
  })

  // Settings State
  const [settings, setSettings] = useState({
    defaultPrecision: 6,
    defaultTheme: 'light',
    enableAnalytics: true,
    enableKeyboardShortcuts: true,
    defaultUnits: {
      length: { from: 'meters', to: 'feet' },
      weight: { from: 'kilograms', to: 'pounds' },
      temperature: { from: 'celsius', to: 'fahrenheit' }
    }
  })

  // Analytics State (Mock Data)
  const [analytics, setAnalytics] = useState({
    totalConversions: 15420,
    dailyUsers: 1250,
    popularCategories: [
      { name: 'Length', usage: 35 },
      { name: 'Weight', usage: 28 },
      { name: 'Temperature', usage: 18 },
      { name: 'Volume', usage: 12 },
      { name: 'Other', usage: 7 }
    ],
    conversionTrends: [
      { date: '2024-01-01', conversions: 450 },
      { date: '2024-01-02', conversions: 520 },
      { date: '2024-01-03', conversions: 480 },
      { date: '2024-01-04', conversions: 610 },
      { date: '2024-01-05', conversions: 580 }
    ]
  })

  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')

  // Simple authentication (in production, use proper authentication)
  const handleLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true)
      setAdminPassword('')
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsVisible(false)
  }

  const startEditing = (field, currentValue) => {
    setEditingField(field)
    setTempValue(currentValue)
  }

  const saveEdit = (field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setContent(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: tempValue
        }
      }))
    } else {
      setContent(prev => ({
        ...prev,
        [field]: tempValue
      }))
    }
    setEditingField(null)
    setTempValue('')
  }

  const cancelEdit = () => {
    setEditingField(null)
    setTempValue('')
  }

  const updateSettings = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const tabs = [
    { id: 'content', name: 'Content Management', icon: DocumentTextIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'users', name: 'User Management', icon: UserGroupIcon }
  ]

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 z-50"
        title="Admin Dashboard"
        aria-label="Open admin dashboard"
      >
        <CogIcon className="w-6 h-6" />
      </button>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Admin Login
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="input-field pr-10"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full btn-primary"
            >
              Login
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Demo password: admin123
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Content Management
                </h3>
                
                {/* About Us Section */}
                <div className="converter-card">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">About Us</h4>
                    {editingField !== 'aboutUs' && (
                      <button
                        onClick={() => startEditing('aboutUs', content.aboutUs)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {editingField === 'aboutUs' ? (
                    <div className="space-y-3">
                      <textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="input-field h-24"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveEdit('aboutUs')}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                        >
                          <CheckIcon className="w-4 h-4" />
                          <span className="text-sm">Save</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          <span className="text-sm">Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{content.aboutUs}</p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="converter-card">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    {Object.entries(content.contact).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key}:
                        </span>
                        {editingField === `contact.${key}` ? (
                          <div className="flex items-center space-x-2">
                            <input
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="input-field text-sm"
                            />
                            <button
                              onClick={() => saveEdit(`contact.${key}`)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                            <button
                              onClick={() => startEditing(`contact.${key}`, value)}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Application Settings
                </h3>
                
                <div className="converter-card">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">General Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Precision (decimal places)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={settings.defaultPrecision}
                        onChange={(e) => updateSettings('defaultPrecision', parseInt(e.target.value))}
                        className="input-field w-24"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Theme
                      </label>
                      <select
                        value={settings.defaultTheme}
                        onChange={(e) => updateSettings('defaultTheme', e.target.value)}
                        className="select-field w-48"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="analytics"
                        checked={settings.enableAnalytics}
                        onChange={(e) => updateSettings('enableAnalytics', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="analytics" className="text-sm text-gray-700 dark:text-gray-300">
                        Enable Analytics
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="shortcuts"
                        checked={settings.enableKeyboardShortcuts}
                        onChange={(e) => updateSettings('enableKeyboardShortcuts', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="shortcuts" className="text-sm text-gray-700 dark:text-gray-300">
                        Enable Keyboard Shortcuts
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Analytics Dashboard
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="converter-card text-center">
                    <h4 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {analytics.totalConversions.toLocaleString()}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversions</p>
                  </div>
                  
                  <div className="converter-card text-center">
                    <h4 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {analytics.dailyUsers.toLocaleString()}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily Users</p>
                  </div>
                  
                  <div className="converter-card text-center">
                    <h4 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {analytics.popularCategories[0].usage}%
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Top Category Usage</p>
                  </div>
                </div>
                
                <div className="converter-card">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Popular Categories</h4>
                  <div className="space-y-3">
                    {analytics.popularCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${category.usage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                            {category.usage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Management
                </h3>
                
                <div className="converter-card">
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    User management features would be implemented here in a production environment.
                    This could include user registration, authentication, usage tracking, and user preferences.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
