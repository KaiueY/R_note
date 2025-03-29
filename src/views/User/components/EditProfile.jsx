import React, { useState, useEffect } from "react";
import s from "./EditProfile.module.less";
import { NavBar, Input, Form, Avatar, Modal, Toast } from "antd-mobile";
import MenuItem from "@/components/MenuItem";
import cx from 'classnames'; // 添加 cx 导入

const EditProfile = ({onClose}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editType, setEditType] = useState(""); // 'username' 或 'signature'
  const [inputValue, setInputValue] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // 添加退出动画状态
  const [isEntering, setIsEntering] = useState(true); // 添加入场动画状态

  // 入场动画效果
  useEffect(() => {
    // 组件挂载后，短暂延迟后移除入场动画类
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 500); // 动画持续时间
    
    return () => clearTimeout(timer);
  }, []);

  // 模拟的用户数据，实际应从API获取
  const [userData, setUserData] = useState({
    username: "用户昵称",
    signature: "这是我的个性签名，记录生活的点点滴滴"
  });

  const handleClose = () => {
    setIsExiting(true); // 修改为设置退出动画状态
    // 等待动画完成后再关闭
    setTimeout(() => {
      onClose();
    }, 450); // 略小于动画时间
  };

  // 打开编辑模态框
  const openEditModal = (type) => {
    const value = type === "username" ? userData.username : userData.signature;
    setEditType(type);
    setInputValue(value);
    setOriginalValue(value);
    setModalVisible(true);
  };

  // 关闭模态框
  const closeModal = () => {
    setModalVisible(false);
  };

  // 处理输入变化
  const handleInputChange = (value) => {
    setInputValue(value);
  };

  // 保存修改
  const saveChanges = async () => {
    // 验证输入
    if (!inputValue.trim()) {
      Toast.show({
        content: editType === "username" ? "用户名不能为空" : "个性签名不能为空",
        position: "center"
      });
      return;
    }

    // 字数限制验证
    const limit = editType === "username" ? 20 : 50;
    if (inputValue.length > limit) {
      Toast.show({
        content: `${editType === "username" ? "用户名" : "个性签名"}不能超过${limit}个字符`,
        position: "center"
      });
      return;
    }

    // 如果内容未改变，直接关闭模态框
    if (inputValue === originalValue) {
      closeModal();
      return;
    }

    // 发送请求
    setLoading(true);
    try {
      // 这里使用模拟的异步请求，实际项目中应替换为真实API调用
      // const result = await post('/api/user/update', {
      //   [editType]: inputValue
      // });
      
      // 模拟异步请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新本地数据
      setUserData(prev => ({
        ...prev,
        [editType]: inputValue
      }));
      
      Toast.show({
        content: "保存成功",
        position: "center"
      });
      closeModal();
    } catch (error) {
      Toast.show({
        content: "保存失败，请重试",
        position: "center"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx(s.file, { 
      [s.exit]: isExiting,
      [s.enter]: isEntering // 添加入场动画类
    })}>
      <div className={s.head}>
        <NavBar back="返回" onBack={handleClose}> {/* 修正函数调用方式 */}
          个人资料
        </NavBar>
      </div>
      <div className={s.body}>
        <div className={s.item}>
          <div>
            <h2>头像</h2>
          </div>
          <div className={s.avatar}>
            <Avatar
              src="https://tamashiiweb.com/images/item/item_0000015237_XNAZhpwE_01.jpg"
              style={{ "--size": "36px", "--border-radius": "50%" }}
            />
          </div>
        </div>
        <MenuItem
          title="用户"
          centerContent={
            <span className={s.description}>
              {userData.username}
            </span>
          }
          style={{ marginTop: "10px", paddingLeft: "0" }}
          onClick={() => openEditModal("username")}
        />
        <MenuItem
          title="个性签名"
          centerContent={
            <span className={s.description}>
              {userData.signature}
            </span>
          }
          style={{ marginTop: "10px", paddingLeft: "0" }}
          onClick={() => openEditModal("signature")}
        />
      </div>

      {/* 编辑模态框 */}
      <Modal
        visible={modalVisible}
        content={
          <div className={s.modalContent}>
            <h3 className={s.modalTitle}>
              {editType === "username" ? "编辑用户名" : "编辑个性签名"}
            </h3>
            <Input
              placeholder={editType === "username" ? "请输入用户名" : "请输入个性签名"}
              value={inputValue}
              onChange={handleInputChange}
              clearable
              className={s.modalInput}
              maxLength={editType === "username" ? 20 : 50}
            />
            <div className={s.charCount}>
              {inputValue.length}/{editType === "username" ? 20 : 50}
            </div>
          </div>
        }
        closeOnAction
        onClose={closeModal}
        actions={[
          {
            key: "cancel",
            text: "取消",
            onClick: closeModal
          },
          {
            key: "save",
            text: "保存",
            bold: true,
            loading: loading,
            onClick: saveChanges
          }
        ]}
      />
    </div>
  );
};

export default EditProfile;
