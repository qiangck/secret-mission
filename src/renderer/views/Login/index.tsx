import { LoginForm, ProFormText, ProFormInstance } from '@ant-design/pro-form';
import { UserOutlined, SendOutlined, LockOutlined } from '@ant-design/icons';
import {
  Form,
  Tabs,
  message,
  Modal,
  Row,
  Col,
  Button,
  Space,
  Progress,
} from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as API from '../../api';
import Modify from '../../components/Modify';
import { setSession } from '../../utils';
import './index.css';

type LoginType = 'register' | 'account';

const useCountDown = (count: number = 5, success?: VoidFunction) => {
  const [counter, setCounter] = useState(count);

  const [start, setStart] = useState<boolean>(false);

  const startCount = () => {
    setStart(!start);
  };

  const resetCount = () => {
    setStart(false);
    setCounter(count);
  };

  useEffect(() => {
    if (start) {
      if (counter > 0) {
        let timer = setTimeout(() => {
          setCounter(counter - 1);

          clearTimeout(timer);
        }, 1000);
      } else {
        typeof success === 'function' && success();
      }
    }
  }, [counter, start]);

  return {
    counter,
    startCount,
    resetCount,
  };
};

export default function Login() {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const [showButton, setShowButton] = useState<boolean>(true);
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { counter, startCount, resetCount } = useCountDown(25, () => {
    setShowButton(false);
  });
  const [registerForm, setRegisterForm] = useState<any>({
    show: false,
    data: [],
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const registerStyle = {
    width: 30,
    height: 30,
    lineHeight: '30px',
    background: '#ff4d4f',
    color: '#fff',
    display: 'inline-block',
  };

  const formRef = useRef<ProFormInstance<any>>();

  const handleFinish = async (values: any) => {
    if (loginType === 'register') {
      const result = await API.get('GET_MNEMONIC_WORDS', values.username);

      const data = result.data || {};

      const mnemonicWords = data.mnemonicWords.split(',');

      setMnemonicWords(mnemonicWords);

      setRegisterForm({
        show: true,
        data: mnemonicWords,
      });

      startCount();
    } else {
      const result = await API.get('USER_LOGIN', {
        username: values['account-username'],
        password: values['account-password'],
      });

      const data = result.data || {};

      setSession(data.sessionid);

      message.success('登录成功');

      navigate(from, { replace: true });
    }
  };

  const handleRegisterSubmit = async () => {
    // 获取输入数据
    const getValues: any = formRef.current?.getFieldsFormatValue?.();

    await API.get('USER_REGISTER', {
      email: getValues.email,
      username: getValues.username,
      password: getValues.password,
      repeatPassword: getValues.repeatPassword,
      mnemonicWords: registerForm.data,
    });

    // 关闭弹框
    setRegisterForm({ show: false, data: [] });
    // 切换Tab
    setLoginType('account');
    // 重置倒计时
    resetCount();
    // 重置输入框
    formRef.current?.resetFields([
      'username',
      'password',
      'repeatPassword',
      'email',
    ]);
    // 设置登录框
    formRef?.current?.setFieldsValue({
      'account-username': getValues.username,
      'account-password': getValues.password,
    });

    message.success('注册成功，请进行登录');
  };

  const handleModifyPassword = async (values: any) => {
    await API.get('USER_PASSWORD_MODIFY', values);

    message.success('修改密码成功');

    setIsModalVisible(false);
  };

  useEffect(() => {
    window.localStorage.clear()
  })

  return (
    <div className="login">
      <div className="ship">
        <div className="ship-body">
          <div className="eyes">
            <span className="eye_1"></span>
            <span className="eye_2"></span>
          </div>
          <svg
            className="vawes"
            xmlns="https://www.w3.org/2000/svg"
            xmlnsXlink="https://www.w3.org/1999/xlink"
            viewBox="0 0 50 50"
          >
            <defs>
              <circle id="wave" cx="25" cy="25" r="24" />
            </defs>
            <use xlinkHref="#wave" className="wave_1" />
            <use xlinkHref="#wave" className="wave_2" />
          </svg>
        </div>
        <div className="foot_1"></div>
        <div className="foot_2"></div>
        <div className="foot_3"></div>
      </div>
      <LoginForm
        title="Secret Mission"
        subTitle="X星球发起の秘密任务"
        onFinish={handleFinish}
        formRef={formRef}
        className='login-form'
      >
        <Tabs
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
          <Tabs.TabPane key={'register'} tab={'注册'} />
        </Tabs>
        {loginType === 'account' && (
          <>
            <ProFormText
              key={1}
              name="account-username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              key={2}
              name="account-password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <a
                style={{
                  float: 'right',
                  paddingBottom: 10,
                }}
                onClick={() => setIsModalVisible(true)}
              >
                忘记密码
              </a>
            </div>
          </>
        )}
        {loginType === 'register' && (
          <>
            <ProFormText
              key={3}
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              key={4}
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
                visibilityToggle: false,
              }}
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <Form.Item noStyle shouldUpdate validateFirst={false}>
              {({ getFieldValue }) => {
                return (
                  <ProFormText.Password
                    key={6}
                    name="repeatPassword"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined />,
                      visibilityToggle: false,
                    }}
                    placeholder="请再次输入密码"
                    rules={[
                      {
                        required: true,
                        message: '请再次输入密码',
                      },
                      {
                        validator: async (rule, value) => {
                          if (value && value !== getFieldValue('password')) {
                            throw new Error('两次密码输入不一致');
                          }
                        },
                      },
                    ]}
                  />
                );
              }}
            </Form.Item>
            <ProFormText
              key={5}
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <SendOutlined />,
              }}
              placeholder="请输入邮箱地址"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱地址!',
                },
                {
                  type: 'email',
                  message: '请输入正确的邮箱地址',
                },
              ]}
            />
          </>
        )}

        <Modal
          width={300}
          visible={registerForm.show}
          footer={null}
          closable={false}
        >
          <Space direction="vertical">
            <p>请准确抄写并安全备份助记词</p>

            <Row gutter={[16, 16]}>
              {mnemonicWords.map((str: string, index: number) => {
                return (
                  <Col span={6} style={{ textAlign: 'center' }} key={index}>
                    <div style={registerStyle}>{str}</div>
                  </Col>
                );
              })}
            </Row>
            <Progress
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              percent={Math.abs(counter * 4 - 100)}
            />
            <Button
              type="primary"
              block
              disabled={showButton}
              onClick={handleRegisterSubmit}
            >
              我已经记录完成
            </Button>
          </Space>
        </Modal>

        <Modify
          isAuth={false}
          visible={isModalVisible}
          handleOk={handleModifyPassword}
          handleCancel={() => {
            setIsModalVisible(false);
          }}
        />
      </LoginForm>
    </div>
  );
}
