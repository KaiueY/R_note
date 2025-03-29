import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import tokenManager from '@/utils/tokenManager';

/**
 * 受保护的路由组件
 * 如果用户未登录，将重定向到登录页面
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = tokenManager.isLoggedIn();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    if (!isLoggedIn) {
      // 显示Toast提示
      Toast.show({
        content: '身份过期，请重新登录',
        position: 'center',
        duration: 1500, // 设置显示时间为1.5秒
        afterClose: () => {
          // Toast关闭后再执行重定向
          setShouldRedirect(true);
        }
      });
    }
  }, [isLoggedIn]);

  // 如果已登录，直接渲染子组件
  if (isLoggedIn) {
    return children;
  }
  
  // 如果未登录且应该重定向，则重定向到登录页面
  if (shouldRedirect) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // 如果未登录但还不应该重定向（等待Toast显示完），返回null或加载状态
  return null; // 或者返回一个加载指示器
};

export default ProtectedRoute;