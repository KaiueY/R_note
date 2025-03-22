import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' 
import 'lib-flexible/flexible'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'//路由放置在入口文件中

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <App />
    </Router>
  </StrictMode>,
)
