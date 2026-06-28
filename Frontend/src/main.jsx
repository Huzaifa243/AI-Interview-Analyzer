import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import App from './App.jsx'
import "./style.scss"
import { Toaster } from "sonner";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
      <Toaster
        position="top-right"
        richColors
        theme="dark"
      />
  </StrictMode>,
)
                   