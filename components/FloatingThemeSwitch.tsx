import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

const FloatingThemeSwitch: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'Light' ? 'Dark' : 'Light')
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="fixed bottom-6 right-6 z-50 p-3 bg-bkg-3 hover:bg-bkg-4 border border-bkg-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5 text-fgd-1" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 bg-bkg-3 hover:bg-bkg-4 border border-bkg-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === 'Light' ? (
        <Moon className="w-5 h-5 text-fgd-1" />
      ) : (
        <Sun className="w-5 h-5 text-fgd-1" />
      )}
    </button>
  )
}

export default FloatingThemeSwitch
