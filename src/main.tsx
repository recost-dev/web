import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '../app/globals.css'
import App from './App'

// Disable pinch-to-zoom on iOS (viewport meta user-scalable=no is ignored since iOS 10)
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) e.preventDefault()
}, { passive: false })

createRoot(document.getElementById('root')!).render(<App />)
