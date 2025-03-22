import { useState, useRef, useEffect } from 'react';

export const useHeader = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [headerState, setHeaderState] = useState('visible'); // 新增：使用状态代替直接计算样式
  const SCROLL_THRESHOLD = 50;
  
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const headerHeight = useRef(0);

  useEffect(() => {
    if (headerRef.current) {
      headerHeight.current = headerRef.current.offsetHeight;
    }
  }, []);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollDiff = scrollTop - lastScrollTop;
    
    if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
      if (scrollDiff > 0 && isHeaderVisible) {
        setIsHeaderVisible(false);
      } 
      else if (scrollDiff < 0 && !isHeaderVisible && scrollTop < 100) {
        setIsHeaderVisible(true);
      }
      setLastScrollTop(scrollTop);
    }
    
    setScrollY(scrollTop);
    
    // 根据滚动位置更新头部状态
    if (scrollTop === 0) {
      setHeaderState('visible');
    } else if (scrollTop < 100) {
      setHeaderState('fading');
    } else {
      setHeaderState('hidden');
    }
  };

  // 移除直接计算样式的代码
  // const headerOpacity = isHeaderVisible ? Math.max(0, 1 - scrollY / (headerHeight.current / 1.5)) : 0;
  // const headerScale = isHeaderVisible ? Math.max(0.8, 1 - scrollY / (headerHeight.current * 2)) : 0.8;
  // const summaryOpacity = isHeaderVisible ? 0 : 1;

  return {
    scrollY,
    isHeaderVisible,
    headerRef,
    bodyRef,
    headerHeight,
    handleScroll,
    headerState, // 返回状态而不是具体样式值
    // headerOpacity,
    // headerScale,
    // summaryOpacity
  };
};