import React, { useEffect,useState } from "react";
import {
  // HashRouter as Router, //放在main.jsx中，
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import routes from './router'
import { ConfigProvider, } from "antd-mobile";
import NavBar from "./components/NavBar";
import zhCN from 'antd-mobile/es/locales/zh-CN'
// import 'zarm/dist/zarm.css';//vite-plugin-style-import自动引入
// import { getUserInfo } from "./utils";
import s from './App.module.less'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const location = useLocation();
  const [showNav,setShowNav] = useState(false)
  // 判断当前路径是否需要navBar 白名单
  const needNav = ['/','/data','/home','/user']
  
  useEffect(()=>{
    // console.log({location});
    // console.log('location.pathname',location.pathname);
    fetch('/api/test').then(res=>res.json()).then(res=>{
      console.log('res',res);
    })
    setShowNav(needNav.includes(location.pathname))
    // location.pathname in needNav ? setShowNav(true) : setShowNav(false)
    // 当前路径变化需要设置navBar的显示与否
  },[location.pathname]) // 添加 location.pathname 作为依赖项

  return (
      <ConfigProvider locale={zhCN}>
        {/* <Router>//既然是单页应用放在main.jsx中， */}
        <div className={s.app}>

          <Routes>
            {
              routes.map(route => {
                // 登录页面不需要保护
                if (route.path === '/login') {
                  return <Route key={route.path} path={route.path} element={<route.component />} />
                }
                
                // 其他页面需要保护
                return (
                  <Route 
                    key={route.path} 
                    path={route.path} 
                    element={
                      <ProtectedRoute>
                        <route.component />
                      </ProtectedRoute>
                    } 
                  />
                )
              })
            }
          </Routes>
          <NavBar  showNav = {showNav}/> {/* 移到 Router 内部  因为组件中使用了react-router-dom*/}
            </div>
        {/* </Router> */}
      </ConfigProvider>
  )
}