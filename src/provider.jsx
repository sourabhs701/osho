import { ThemeProvider } from '@/components/ThemeContext'

export function Providers({ children }) {
    return <ThemeProvider>{children}</ThemeProvider>
}   