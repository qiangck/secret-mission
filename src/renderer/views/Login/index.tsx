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

      message.success('????????????');

      navigate(from, { replace: true });
    }
  };

  const handleRegisterSubmit = async () => {
    // ??????????????????
    const getValues: any = formRef.current?.getFieldsFormatValue?.();

    await API.get('USER_REGISTER', {
      email: getValues.email,
      username: getValues.username,
      password: getValues.password,
      repeatPassword: getValues.repeatPassword,
      mnemonicWords: registerForm.data,
    });

    // ????????????
    setRegisterForm({ show: false, data: [] });
    // ??????Tab
    setLoginType('account');
    // ???????????????
    resetCount();
    // ???????????????
    formRef.current?.resetFields([
      'username',
      'password',
      'repeatPassword',
      'email',
    ]);
    // ???????????????
    formRef?.current?.setFieldsValue({
      'account-username': getValues.username,
      'account-password': getValues.password,
    });

    message.success('??????????????????????????????');
  };

  const handleModifyPassword = async (values: any) => {
    await API.get('USER_PASSWORD_MODIFY', values);

    message.success('??????????????????');

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
        subTitle="X???????????????????????????"
        onFinish={handleFinish}
        formRef={formRef}
        className='login-form'
      >
        <Tabs
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'account'} tab={'??????????????????'} />
          <Tabs.TabPane key={'register'} tab={'??????'} />
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
              placeholder="??????????????????"
              rules={[
                {
                  required: true,
                  message: '??????????????????!',
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
              placeholder="???????????????"
              rules={[
                {
                  required: true,
                  message: '??????????????????',
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
                ????????????
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
              placeholder="??????????????????"
              rules={[
                {
                  required: true,
                  message: '??????????????????!',
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
              placeholder="???????????????"
              rules={[
                {
                  required: true,
                  message: '??????????????????',
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
                    placeholder="?????????????????????"
                    rules={[
                      {
                        required: true,
                        message: '?????????????????????',
                      },
                      {
                        validator: async (rule, value) => {
                          if (value && value !== getFieldValue('password')) {
                            throw new Error('???????????????????????????');
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
              placeholder="?????????????????????"
              rules={[
                {
                  required: true,
                  message: '?????????????????????!',
                },
                {
                  type: 'email',
                  message: '??????????????????????????????',
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
            <p>???????????????????????????????????????</p>

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
              ?????????????????????
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
