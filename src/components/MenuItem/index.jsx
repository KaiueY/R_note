import React from "react";
import { Toast } from "antd-mobile";
import CustomIcon from "@/components/CustomIcon";
import s from "./style.module.less";

/**
 * @param {Object} props
 * @param {string} props.title - 菜单项标题
 * @param {React.ReactNode} props.iconType - 自定义左侧图标
 * @param {React.ReactNode} props.rightContent - 自定义右侧内容
 * @param {Function} props.onClick - 点击事件处理函数
 * @param {Boolean} props.expanded -  是否展开
 * @param {string} props.description - 菜单项描述
 * @param {Object} props.style - 自定义样式
 */
const MenuItem = ({
  title,
  iconType,
  rightContent,
  onClick,
  expanded,
  description,
  style,
}) => {
  // 默认点击处理函数
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Toast.show(title);
    }
  };

  // 默认右侧内容为箭头图标
  const defaultRightContent = (
    <CustomIcon type="note-icon-arrow-right2" />
  );

  return (
    <div className={s.item} style={style} onClick={handleClick}>
      <div className={s.top}>
        <div className={s.left}>
          <CustomIcon type={iconType} className={s.iconPlaceholder} />
          <span>{title}</span>
        </div>
        <div className={s.right}>{rightContent || defaultRightContent}</div>
      </div>
      {
        (description && !expanded )&& <div className={s.bottom}>{description}</div>
      }
    </div>
  );
};

export default MenuItem;
