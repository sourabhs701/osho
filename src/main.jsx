import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Providers } from './provider.jsx'
import { cn } from './lib/utils'

createRoot(document.getElementById('root')).render(
  <Providers >
    <StrictMode>
      <div
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6"
        )}
      >
        <App />
      </div>
    </StrictMode>,
  </Providers >
)
