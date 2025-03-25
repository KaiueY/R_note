import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' 
import './assets/css/global.less' // 引入全局样式
import './assets/css/theme.less' // 引入主题样式
import 'lib-flexible/flexible'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'//路由放置在入口文件中
// 导入Mock.js配置，确保在应用启动时初始化Mock拦截器
import './utils/mock'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  </StrictMode>,
)
