import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import PropTypes from 'prop-types';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4852017_cll5yh468r.js',
});

// 包装一层组件，添加类型检查和默认值
const CustomIcon = ({ type, ...props }) => {
  // 确保始终有一个有效的type值
  if (!type) {
    console.warn('CustomIcon: type prop is required');
    return null; // 或者返回一个默认图标
  }
  
  return <IconFont type={type} {...props} />;
};

CustomIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default CustomIcon;


