import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeContext'

export default function ThemeSwitch() {
    const { theme, toggleTheme, mounted } = useTheme()

    if (!mounted) {
        return (
            <div className="w-10 h-10 flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
        )
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    )
}