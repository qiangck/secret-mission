import { useState, useMemo, useRef } from 'react';
import { Modal, Button, Row, Col, Input, Form, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import * as API from '../../api';

type WordType = {
  inputValue: string;
};

export default function Modify(props: any) {
  const getArrs = () => new Array(12).fill({ inputValue: '' });

  const formRef = useRef<ProFormInstance>();

  const paramsObj = {
    footer: null,
    width: 300,
    destroyOnClose: true,
    maskClosable: false,
  };

  const [wordInput, setWordInput] = useState<WordType[]>(getArrs());

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const wordDisabled = useMemo(
    () => wordInput.some((item) => !item.inputValue),
    [wordInput]
  );

  const onFinish = async () => {
    const mnemonicWords = wordInput.map((item) => item.inputValue).join(',');

    const values = formRef.current?.getFieldsValue();

    await props.handleOk({
      mnemonicWords,
      ...values,
    });

    setWordInput(getArrs());

    setPasswordVisible(false);
  };

  const handleConfirmPassword = async () => {
    await formRef.current?.validateFields();

    setPasswordVisible(true);
  };

  const handleWordInput = (value: string, index: number) => {
    setWordInput((prevValue) => {
      return prevValue.map((n, i) => {
        let obj = { ...n };

        if (i === index) {
          obj['inputValue'] = value;
        }

        return obj;
      });
    });
  };

  return (
    <>
      <Modal
        title="修改密码"
        visible={props.visible}
        {...paramsObj}
        onCancel={() => {
          props.handleCancel();
        }}
      >
        <ProForm
          onFinish={onFinish}
          preserve={false}
          formRef={formRef}
          submitter={{
            render: () => (
              <Form.Item>
                <Button block type="primary" onClick={handleConfirmPassword}>
                  确认
                </Button>
              </Form.Item>
            ),
          }}
        >
          {props.isAuth === false && (
            <ProFormText
              name="username"
              fieldProps={{
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
          )}

          <ProFormText.Password
            name="newPassword"
            fieldProps={{
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
                  name="confirmPassword"
                  fieldProps={{
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
                        if (value && value !== getFieldValue('newPassword')) {
                          throw new Error('两次密码输入不一致');
                        }
                      },
                    },
                  ]}
                />
              );
            }}
          </Form.Item>
        </ProForm>
      </Modal>

      <Modal
        title="请输入助记词"
        visible={passwordVisible}
        {...paramsObj}
        onCancel={() => {
          setPasswordVisible(false);

          setWordInput(getArrs());
        }}
      >
        <>
          <Row gutter={[16, 16]}>
            {wordInput.map((node, index) => (
              <Col span={6} key={index}>
                <Input
                  maxLength={1}
                  value={node.inputValue}
                  onChange={(e) => {
                    handleWordInput(e.target.value, index);
                  }}
                />
              </Col>
            ))}
          </Row>

          <Button
            block
            type="primary"
            disabled={wordDisabled}
            style={{ marginTop: 20 }}
            onClick={onFinish}
          >
            确认
          </Button>
        </>
      </Modal>
    </>
  );
}
