import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form, Input, Button, Checkbox, Toast } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import CustomIcon from "@/components/CustomIcon";

import cx from "classnames";
import s from "./style.module.less";

const Login = () => {
  const [type, setType] = useState("login");
  const [loading, setLoading] = useState(false); // 添加loading状态
  const [visible, setVisible] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false); // 添加同意条款状态
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "登录";
  }, []);

  // 处理登录/注册按钮点击
  const handleSubmit = () => {
    setLoading(true);
    // 这里添加登录/注册的逻辑
    // 模拟请求延迟
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
              onBlur={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="请输入账号"
            />
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
            />
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
                disabled={loading}
                type={visible ? "text" : "password"}
                placeholder="请再次输入密码"
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
