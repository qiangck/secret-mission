import React, { useEffect, useState } from 'react';
import {
  Slider,
  Checkbox,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';

interface CollectionCreateFormProps {
  visible: boolean;
  onCreate: (values: string) => void;
  onCancel: () => void;
}

const useCreatePassword = ({ total = 5, include = [0, 1, 2, 3] }) => {
  const [password, setPassword] = useState<string>('');

  const includeMap: any = {
    0: '0123456789',
    1: 'abcdefghijklmnopqrstuvwxyz',
    2: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    3: '!@#$%^&*()',
  };

  const create = (_total: number, _include: number[] = []) => {
    if (_total === undefined || _total === null || _total === NaN) {
      _total = total;
    }

    if (!_include.length) {
      _include = include;
    }

    let chars = '';
    let password = '';

    _include.forEach((key: number) => {
      chars += includeMap[key];
    });

    for (let i = 0; i <= _total; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);

      password += chars.substring(randomNumber, randomNumber + 1);
    }

    setPassword(password);
  };

  useEffect(() => {
    create(total, include);
  }, []);

  return {
    password,
    create,
  };
};

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
  const initialValues = {
    total: 8,
    include: [0, 1],
  };

  const [form] = Form.useForm();

  const { password, create } = useCreatePassword(initialValues);

  useEffect(() => {
    if (!visible) {
      create(initialValues.total, initialValues.include);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title="生成密码"
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then(() => {
          form.resetFields();

          onCreate(password);
        });
      }}
    >
      <Form
        form={form}
        initialValues={initialValues}
        onFieldsChange={(_, allFields) => {
          let params: any = {};

          allFields.forEach((item: any) => {
            params[item.name[0]] = item.value;
          });

          create(params.total, params.include);
        }}
      >
        <Form.Item label="密码内容">
          <Input.Group compact>
            <Input style={{ width: 'calc(100% - 200px)' }} value={password} />

            <Button
              type="primary"
              onClick={() => {
                window.secretfns.CLIPBOARD_DATA(password);

                message.success('复制成功');
              }}
            >
              复制
            </Button>
          </Input.Group>
        </Form.Item>
        <Form.Item
          name="total"
          label="密码长度"
          rules={[{ required: true, message: '请选择密码长度' }]}
        >
          <Slider min={5} max={36} />
        </Form.Item>

        <Form.Item
          name="include"
          label="密码包含"
          rules={[{ required: true, message: '请选择其中一种包含的内容' }]}
        >
          <Checkbox.Group>
            <Row>
              <Col>
                <Checkbox value={0}>A-Z</Checkbox>
              </Col>

              <Col>
                <Checkbox value={1}>a-z</Checkbox>
              </Col>

              <Col>
                <Checkbox value={2}>0-9</Checkbox>
              </Col>

              <Col>
                <Checkbox value={3}>!@#$%^&*</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function Generator({
  onSubmit,
}: {
  onSubmit: (password: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  const onCreate = (password: string) => {
    onSubmit(password);
    setVisible(false);
  };

  return (
    <>
      <SettingOutlined
        onClick={() => {
          setVisible(true);
        }}
      />
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
