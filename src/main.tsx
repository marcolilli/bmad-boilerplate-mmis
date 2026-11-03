import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WorkoutBuilder } from './ui/WorkoutBuilder'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><WorkoutBuilder /></StrictMode>,
)
