
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/style.css'
import { Drag } from './components/drag.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Drag />  
    
  </StrictMode>,
)
