import { createRoot } from 'react-dom/client'
import SamifyWidget from './SamifyWidget.jsx'
import './styles.css'

function mount() {
  if (document.getElementById('samify-widget-root')) return
  const root = document.createElement('div')
  root.id = 'samify-widget-root'
  document.body.appendChild(root)
  createRoot(root).render(<SamifyWidget />)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
