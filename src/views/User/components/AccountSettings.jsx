import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Toast } from 'antd-mobile';
import s from './accountSettings.module.less';
import CustomIcon from '@/components/CustomIcon';
import cx from 'classnames';

const AccountSettings = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('changePassword'); // 'changePassword' 或 'resetPassword'
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true); // 添加入场状态

  // 入场动画效果
  useEffect(() => {
    // 组件挂载后，短暂延迟后移除入场动画类
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 500); // 动画持续时间
    
    return () => clearTimeout(timer);
  }, []);

  // 处理关闭
  const handleClose = () => {
    setIsExiting(true);
    // 等待动画完成后再关闭
    setTimeout(() => {
      onClose();
    }, 450); // 略小于动画时间
  };

  // 处理修改密码表单提交
  const handleChangePasswordSubmit = (values) => {
    console.log('修改密码表单提交:', values);
    // 这里添加修改密码的API调用
    Toast.show({
      icon: 'success',
      content: '密码修改成功',
    });
    handleClose();
  };

  // 处理重置密码表单提交
  const handleResetPasswordSubmit = (values) => {
    console.log('重置密码表单提交:', values);
    // 这里添加重置密码的API调用
    Toast.show({
      icon: 'success',
      content: '重置密码邮件已发送',
    });
    handleClose();
  };

  return (
    <div className={cx(s.accountSettingsContainer, { 
      [s.exit]: isExiting,
      [s.enter]: isEntering // 添加入场动画类
    })}>
      <div className={s.header}>
        <div className={s.closeButton} onClick={handleClose}>
          <CustomIcon type="note-arrow-left-s-line" />
        </div>
        <h2>账户设置</h2>
      </div>
      
      <div className={s.tabs}>
        <div 
          className={`${s.tab} ${activeTab === 'changePassword' ? s.active : ''}`}
          onClick={() => setActiveTab('changePassword')}
        >
          修改密码
        </div>
        <div 
          className={`${s.tab} ${activeTab === 'resetPassword' ? s.active : ''}`}
          onClick={() => setActiveTab('resetPassword')}
        >
          重置密码
        </div>
      </div>
      
      <div className={s.content}>
        {activeTab === 'changePassword' ? (
          <div className={s.changePasswordForm}>
            <Form
              layout='vertical'
              onFinish={handleChangePasswordSubmit}
              footer={
                <Button block type='submit' color='primary' size='large'>
                  确认修改
                </Button>
              }
            >
              <Form.Item
                name='oldPassword'
                label='当前密码'
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input autoComplete='oldPassword' type='password' placeholder='请输入当前密码' />
              </Form.Item>
              <Form.Item
                name='newPassword'
                label='新密码'
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度不能少于6位' }
                ]}
              >
                <Input autoComplete='newPassword' type='password' placeholder='请输入新密码' />
              </Form.Item>
              <Form.Item
                name='confirmPassword'
                label='确认新密码'
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input type='password' autoComplete='newPassword' placeholder='请再次输入新密码' />
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div className={s.resetPasswordForm}>
            <Form
              layout='vertical'
              onFinish={handleResetPasswordSubmit}
              footer={
                <Button block type='submit' color='primary' size='large'>
                  发送重置邮件
                </Button>
              }
            >
              <Form.Item
                name='email'
                label='注册邮箱'
                rules={[
                  { required: true, message: '请输入注册邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder='请输入注册邮箱' />
              </Form.Item>
              <div className={s.resetTip}>
                <CustomIcon type="note-tishi" />
                <span>重置密码链接将发送到您的注册邮箱</span>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;