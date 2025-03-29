import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form, Input, Button, Checkbox, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import CustomIcon from "@/components/CustomIcon";
import { useNavigate, useLocation } from 'react-router-dom';
import {userService} from '@/api/services'; 
import tokenManager from "@/utils/tokenManager"; 

import cx from "classnames";
import s from "./style.module.less";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 获取用户之前尝试访问的页面路径
  // 优先从URL参数中获取redirect，其次从location.state中获取from
  const getRedirectPath = () => {
    // 从URL参数中获取redirect
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    
    if (redirectParam) {
      return redirectParam;
    }
    
    // 从location.state中获取from
    return location.state?.from || '/';
  };
  
  const redirectPath = getRedirectPath();
  const [type, setType] = useState("login");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // 表单数据
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  
  // 表单错误信息
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    document.title = type === "login" ? "登录" : "注册";
  }, [type]);

  // 验证表单
  const validateForm = () => {
    let isValid = true;
    
    // 重置错误信息
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    
    // 验证用户名
    if (!username.trim()) {
      setUsernameError("请输入用户名");
      isValid = false;
    } else if (username.length < 3 || username.length > 20) {
      setUsernameError("用户名长度应为3-20个字符");
      isValid = false;
    }
    
    // 验证密码
    if (!password) {
      setPasswordError("请输入密码");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("密码长度不能少于6个字符");
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z]|.*[0-9]|.*[!@#$%^&*]).{6,}$/.test(password)) {
      setPasswordError("密码需包含字母和数字或特殊字符");
      isValid = false;
    }
    
    // 注册时验证确认密码
    if (type === "register") {
      if (!confirmPassword) {
        setConfirmPasswordError("请再次输入密码");
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError("两次输入的密码不一致");
        isValid = false;
      }
      
      // 验证是否同意条款
      if (!agreeTerms) {
        Toast.show({
          content: "请阅读并同意使用条款",
          position: "center"
        });
        isValid = false;
      }
    }
    
    return isValid;
  };
  
  // 处理登录/注册按钮点击
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (type === "login") {
        // 登录请求
        const res = await userService.login({ username, password });
        console.log("登录成功", res.data);
        
        // 使用tokenManager存储token和用户信息
        if (res.data) {
          tokenManager.saveTokens(res.data);
          
          Toast.show({
            content: "登录成功",
            position: "center"
          });
          
          // 跳转到用户之前尝试访问的页面或首页
          navigate(redirectPath);
        }
      } else {
        // 注册请求
        const res = await userService.register({ username, password, email });
        
        Toast.show({
          content: "注册成功，请登录",
          position: "center"
        });
        
        // 切换到登录页
        setType("login");
      }
    } catch (error) {
      // 处理错误
      const errorMsg = error.response?.data?.message || error.message || "操作失败";
      Toast.show({
        content: errorMsg,
        position: "center"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.auth}>
      <div className={s.head}></div>
      <div className={s.tab}>
        <span
          className={cx({ [s.active]: type == "login" })}
          onClick={() => setType("login")}
        >
          登录
        </span>
        <span
          className={cx({ [s.active]: type == "register" })}
          onClick={() => setType("register")}
        >
          注册
        </span>
      </div>
      <div className={s.form}>
        <Form>
          <Form.Header> </Form.Header>
          <Form.Item className={s.formItem}>
            <Input
              autoComplete="username"
              clearable
              disabled={loading}
              onChange={(val) => {
                setUsername(val);
                setUsernameError("");
              }}
              placeholder="请输入账号"
              value={username}
            />
            {usernameError && <div className={s.errorTip}>{usernameError}</div>}
          </Form.Item>
          <Form.Header> </Form.Header>
          <Form.Item
            className={s.formItem}
            extra={
              <div>
                {!visible ? (
                  <EyeInvisibleOutline onClick={() => setVisible(true)} />
                ) : (
                  <EyeOutline onClick={() => setVisible(false)} />
                )}
              </div>
            }
          >
            <Input
              autoComplete="new-password"
              type={visible ? "text" : "password"}
              disabled={loading}
              placeholder="请输入密码"
              onChange={(val) => {
                setPassword(val);
                setPasswordError("");
              }}
              value={password}
            />
            {passwordError && <div className={s.errorTip}>{passwordError}</div>}
          </Form.Item>
          <div
            className={cx(s.registerFields, {
              [s.show]: type === "register",
              [s.hide]: type === "login",
            })}
          >
            <Form.Header> </Form.Header>
            <Form.Item
              className={s.formItem}
              extra={
                <div>
                  {!confirmVisible ? (
                    <EyeInvisibleOutline onClick={() => setConfirmVisible(true)} />
                  ) : (
                    <EyeOutline onClick={() => setConfirmVisible(false)} />
                  )}
                </div>
              }
            >
              <Input
                autoComplete="new-password"
                disabled={loading}
                type={confirmVisible ? "text" : "password"}
                placeholder="请再次输入密码"
                onChange={(val) => {
                  setConfirmPassword(val);
                  setConfirmPasswordError("");
                }}
                value={confirmPassword}
              />
              {confirmPasswordError && <div className={s.errorTip}>{confirmPasswordError}</div>}
            </Form.Item>
            
            <Form.Header> </Form.Header>
            <Form.Item className={s.formItem}>
              <Input
                autoComplete="email"
                clearable
                disabled={loading}
                onChange={(val) => setEmail(val)}
                placeholder="请输入邮箱（选填）"
                value={email}
              />
            </Form.Item>
          </div>
        </Form>

        {/* 添加条款复选框，使用与注册字段相同的动画类 */}
        <div
          className={cx(s.termsWrapper, {
            [s.show]: type === "register",
            [s.hide]: type === "login",
          })}
        >
          <Checkbox
            checked={agreeTerms}
            onChange={setAgreeTerms}
            className={s.termsCheckbox}
          >
            <span className={s.termsText}>
              阅读并同意
              <a href="#" className={s.termsLink}>
                使用条款
              </a>
            </span>
          </Checkbox>
        </div>

        <Button
          loading={loading}
          shape="rounded"
          className={s.subButton}
          disabled={loading || (type === "register" && !agreeTerms)} // 注册时需要同意条款才能点击按钮
          onClick={handleSubmit}
        >
          {!loading && (
            <CustomIcon
              type={
                type === "login"
                  ? "note-a-youjiantouzhixiangyoujiantou"
                  : "note-zhuce"
              }
              className={s.btnIcon}
            />
          )}
        </Button>
      </div>
    </div>
  );
};
export default Login;
