import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from './style.module.less';

/**
 * 虚拟列表组件
 * @param {Array} data - 要渲染的数据列表
 * @param {Function} renderItem - 渲染每一项的函数
 * @param {Number} itemHeight - 每一项的高度，可以是固定值或函数
 * @param {Number} bufferSize - 缓冲区大小，默认为5
 * @param {String} className - 自定义类名
 * @param {Object} style - 自定义样式
 * @param {Function} getKey - 获取每一项的key的函数
 */
const VirtualList = ({
  data = [],
  renderItem,
  itemHeight = 60,
  bufferSize = 5,
  className = '',
  style = {},
  getKey = (item, index) => index,
}) => {
  // 容器引用
  const containerRef = useRef(null);
  // 列表引用
  const listRef = useRef(null);
  
  // 可视区域的起始和结束索引
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  // 滚动位置
  const [scrollTop, setScrollTop] = useState(0);
  // 容器高度
  const [containerHeight, setContainerHeight] = useState(0);

  // 计算每一项的高度，可以是固定值或函数
  const getItemHeight = useCallback((index) => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
  }, [itemHeight]);

  // 使用useMemo缓存计算列表总高度的结果
  const totalHeight = useMemo(() => {
    return data.reduce((total, _, index) => total + getItemHeight(index), 0);
  }, [data, getItemHeight]);

  // 使用useMemo缓存计算偏移量的函数
  const getItemOffset = useCallback((index) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  }, [getItemHeight]);

  // 根据滚动位置计算可视区域的起始索引
  const getStartIndex = useCallback((scrollTop) => {
    let offset = 0;
    for (let i = 0; i < data.length; i++) {
      const height = getItemHeight(i);
      if (offset + height > scrollTop) {
        return Math.max(0, i - bufferSize);
      }
      offset += height;
    }
    return 0;
  }, [data, getItemHeight, bufferSize]);

  // 根据起始索引和容器高度计算可视区域的结束索引
  const getEndIndex = useCallback((startIndex, containerHeight, scrollTop) => {
    let offset = getItemOffset(startIndex);
    let endIndex = startIndex;
    
    while (endIndex < data.length && offset < scrollTop + containerHeight) {
      offset += getItemHeight(endIndex);
      endIndex++;
    }
    
    return Math.min(data.length - 1, endIndex + bufferSize);
  }, [data, getItemHeight, getItemOffset, bufferSize]);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const currentScrollTop = containerRef.current.scrollTop;
    setScrollTop(currentScrollTop);
    
    const startIndex = getStartIndex(currentScrollTop);
    const endIndex = getEndIndex(startIndex, containerHeight, currentScrollTop);
    
    // 只有当可视范围发生变化时才更新状态，避免不必要的重渲染
    setVisibleRange(prevRange => {
      if (prevRange.start !== startIndex || prevRange.end !== endIndex) {
        return { start: startIndex, end: endIndex };
      }
      return prevRange;
    });
  }, [getStartIndex, getEndIndex, containerHeight]);

  // 初始化和窗口大小变化时重新计算
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          setContainerHeight(entry.contentRect.height);
          handleScroll();
        }
      }
    });
    
    resizeObserver.observe(containerRef.current);
    setContainerHeight(containerRef.current.clientHeight);
    handleScroll();
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [handleScroll]);

  // 数据变化时重新计算
  useEffect(() => {
    handleScroll();
  }, [data, handleScroll]);

  // 使用useMemo缓存渲染的列表项，避免不必要的重新计算
  const renderedItems = useMemo(() => {
    const items = [];
    for (let i = visibleRange.start; i <= visibleRange.end && i < data.length; i++) {
      const item = data[i];
      const itemStyle = {
        position: 'absolute',
        top: getItemOffset(i),
        width: '100%',
        height: getItemHeight(i),
      };
      
      items.push(
        <div key={getKey(item, i)} style={itemStyle}>
          {renderItem(item, i)}
        </div>
      );
    }
    return items;
  }, [data, visibleRange, getItemOffset, getItemHeight, getKey, renderItem]);

  return (
    <div
      ref={containerRef}
      className={`${styles.virtualListContainer} ${className}`}
      style={{ ...style, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div
        ref={listRef}
        className={styles.virtualList}
        style={{ position: 'relative', height: `${totalHeight}px` }}
      >
        {renderedItems}
      </div>
    </div>
  );
};

export default VirtualList;