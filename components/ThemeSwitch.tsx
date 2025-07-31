import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return mounted ? (
    theme === 'Dark' ? (
      <button
        className="bg-bkg-4 hover:bg-bkg-5 transition-colors flex items-center justify-center h-8 w-8 rounded-md border border-bkg-4"
        onClick={() => setTheme('Light')}
      >
        <Sun className="h-4 text-fgd-1 w-4" />
      </button>
    ) : (
      <button
        className="bg-bkg-4 hover:bg-bkg-5 transition-colors flex items-center justify-center h-8 w-8 rounded-md border border-bkg-4"
        onClick={() => setTheme('Dark')}
      >
        <Moon className="h-4 text-fgd-1 w-4" />
      </button>
    )
  ) : null
}

export default ThemeSwitch
