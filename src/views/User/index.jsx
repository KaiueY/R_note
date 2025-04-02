import React, { useState, useEffect, useRef ,} from 'react';
import { Switch, Toast } from 'antd-mobile';
import MenuItem from "@/components/MenuItem";
import s from './style.module.less';
import { useNavigate } from 'react-router-dom';
import AccountSettings from './components/AccountSettings';
import EditProfile from './components/EditProfile';
import ExportData from './components/ExportData';
import { useTheme } from '@/context/ThemeContext';


const User = () => {
  const [expanded, setExpanded] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showEditProfile,setShowEditProfile] = useState(false);
  const [showExportData, setShowExportData] = useState(false)
  const headerRef = useRef(null);
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // 切换展开/收起状态
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  // 切换主题
  const handleThemeToggle = (checked) => {
    toggleTheme();
    Toast.show(checked ? '已切换到深色模式' : '已切换到浅色模式');
  };
  
  // 退出登录
  const handleLogout = () => {
    navigate('/login')
  };
  
  // 打开账户设置
  const openAccountSettings = () => {
    setShowAccountSettings(true);
  };
  // 打开资料设置
  const openEditProfile = () =>{
    setShowEditProfile(true)
  }
  
  // 打开导出数据
  const openExportData = () => {
    setShowExportData(true);
  }
  
  // 关闭账户设置
  const closeAccountSettings = () => {
    setShowAccountSettings(false);
  };
  const closeEditProfile = () => {
    setShowEditProfile(false);
  };
  
  // 关闭导出数据
  const closeExportData = () => {
    setShowExportData(false);
  };

  // 确保内容区域高度适应视口
  useEffect(() => {
    // const adjustHeight = () => {
    //   const vh = window.innerHeight;
    //   const navBarHeight = 70; // 导航栏高度
    //   document.documentElement.style.setProperty('--vh', `${vh - navBarHeight}px`);
    // };
    
    // adjustHeight();
    // window.addEventListener('resize', adjustHeight);
    // return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  // 定义菜单项数组
  const menuItems = [
    { 
      title: "修改资料", 
      itemIndex: "1",
      iconType: "note-ziliao",
      description: "修改昵称、个性签名、头像等个人信息",
      onClick: openEditProfile
    },
    { 
      title: "账户设置", 
      itemIndex: "2",
      iconType: "note-jifen",
      description: "修改密码、重置密码等账户安全设置",
      onClick: openAccountSettings
    },
    { 
      title: "切换主题", 
      itemIndex: "3",
      description: "切换应用的明暗主题",
      iconType: "note-qiehuanzhuti-01",
      rightContent: (
        <>
          <span className={s.themeText}>
            {isDarkMode ? '深色' : '浅色'}
          </span>
          <Switch
            checked={isDarkMode}
            onChange={handleThemeToggle}
            className={s.themeSwitch}
          />
        </>
      )
    },
    { 
      title: "导出账单", 
      itemIndex: "4",
      description: "将账单数据导出为Excel或CSV格式",
      iconType: "note-daochu1",
      onClick: openExportData
    },
    { 
      title: "使用反馈", 
      itemIndex: "5",
      description: "我们做的怎么样，你怎么看",
      iconType: "note-yijianfankui"
    },

    { 
      title: "退出登录", 
      itemIndex: "6", 
      iconType: "note-tuichu",
      isLogout: true,
      onClick: handleLogout
    }
  ];

  return (
    <div className={s.user}>
      <div 
        className={`${s.head} ${expanded ? s.expanded : ''}`}
        ref={headerRef}
        onClick={toggleExpand}
      >
        <div className={s.userInfo}>
          <div className={`${s.avatar} ${expanded ? s.show : ''}`}>
            <img src="https://tamashiiweb.com/images/item/item_0000015237_XNAZhpwE_01.jpg" alt="头像" />
          </div>
          <div className={s.info}>
            <h2 className={expanded ? s.expanded : ''}>用户昵称</h2>
            <p className={`${s.userId} ${expanded ? s.show : ''}`}>ID: 12345678</p>
            <span className={`${s.signature} ${expanded ? s.show : ''}`}>
              这是我的个性签名，记录生活的点点滴滴
            </span>
          </div>
        </div>
      </div>
      
      <div className={`${s.content} ${expanded ? s.expanded : ''}`}>
        <div className={s.card}>
          {menuItems.map((item, index) => (
            (
              // 在渲染部分
              <MenuItem 
                key={index}
                title={item.title} 
                expanded={expanded} 
                itemIndex={item.itemIndex}
                rightContent={item.rightContent}
                onClick={item.onClick}
                iconType={item.iconType}
                description={item.description}
              />
            )
          ))}
        </div>
      </div>
      {showEditProfile && <EditProfile onClose={closeEditProfile} />}
      {/* 账户设置组件 */}
      {showAccountSettings && <AccountSettings onClose={closeAccountSettings} />}
      {/* 导出数据组件 */}
      {showExportData && <ExportData onClose={closeExportData} />}
    </div>
  );
};

export default User;
