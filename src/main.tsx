import { createRoot } from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/geist-mono'
import '../app/globals.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
