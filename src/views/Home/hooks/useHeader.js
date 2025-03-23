import { useState, useRef, useEffect } from 'react';

export const useHeader = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [headerState, setHeaderState] = useState('visible');
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const SCROLL_THRESHOLD = 50;
  
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const headerHeight = useRef(0);

  useEffect(() => {
    if (headerRef.current) {
      headerHeight.current = headerRef.current.offsetHeight;
    }
  }, []);

  const scrollToTop = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollDiff = scrollTop - lastScrollTop;
    
    // 更新滚动方向状态
    setIsScrollingUp(scrollDiff < 0);
    
    // 控制回到顶部按钮显示
    setShowBackToTop(scrollTop > 300);
    
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

  return {
    scrollY,
    headerRef,
    bodyRef,
    headerHeight,
    handleScroll,
    headerState,
    isScrollingUp,
    showBackToTop,
    scrollToTop
  };

};