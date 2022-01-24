import { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Popconfirm,
  Row,
  Col,
  Empty,
  Space,
  message,
} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import * as API from '../../api';
import FormSubmit from '../FormSubmit';
import { DataType } from '../List';
import Generator from '../Generator';
import './index.css';

type ShowFormType = 'add' | 'detail' | 'delete';

export type ShowFormDataType = {
  show: boolean;
  type?: ShowFormType;
  form?: DataType;
  disabled?: boolean;
};

interface Props {
  onsubmit?: (values: any) => void;
  ondel?: () => void;
  oncancel?: () => void;
  onrecovery?: () => void;
  formData: ShowFormDataType;
}

interface IconRenderProps {
  classname: string;
  visible: boolean;
  onChange: (visible: boolean) => void;
  onClick: VoidFunction;
  onMouseDown: VoidFunction;
  onMouseUp: VoidFunction;
}
export default function FormNode(props: Props) {
  const { onsubmit, onrecovery, ondel, oncancel, formData } = props;
  const [form] = Form.useForm();

  // 类型
  const formTypeValue = [
    { label: '账户', value: 'account' },
    { label: '网站', value: 'network' },
  ];

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        onsubmit &&
          onsubmit({
            ...values,
            other: (values.other || []).map((item: any) => ({
              otherLabel: item.otherLabel,
              otherValue: item.otherValue,
            })),
            urls: (values.urls || []).map((item: any) => ({
              value: item.value,
            })),
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangePassword = (mainPassword: string) => {
    form.setFieldsValue({
      mainPassword,
    });

    message.success('密码替换成功');
  };

  useEffect(() => {
    const { type } = formData;

    if ((type === 'detail' || type === 'delete') && formData.form) {
      form.setFieldsValue(formData.form);
    }
    if (type === 'add') {
      form.resetFields();
    }
  }, [form, formData]);

  return (
    <div className="Form">
      <div className="form-box">
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            projecttype: formTypeValue[0].value,
          }}
        >
          <Card title="基础信息" type="inner" className="form-card">
            {/* <Form.Item
              label="类型"
              name="projecttype"
              rules={[
                {
                  required: true,
                  message: '请选择类型',
                },
              ]}
            >
              <Select placeholder="请选择类型" disabled={formData.disabled}>
                {formTypeValue.map((item) => (
                  <Select.Option value={item.value} key={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}

            <Form.Item
              label="名称"
              name="projectname"
              rules={[
                {
                  required: true,
                  message: '请输入名称',
                },
              ]}
            >
              <Input placeholder="请输入名称" disabled={formData.disabled} />
            </Form.Item>

            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
                {
                  pattern: /^[a-zA-Z0-9_\-@.]{1,}$/,
                  message: '请输入正确的用户名',
                },
              ]}
            >
              <Input placeholder="请输入用户名" disabled={formData.disabled} />
            </Form.Item>

            <Form.Item
              label="密码"
              name="mainPassword"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  pattern: /^[a-zA-Z0-9_\-@.!#$%^&*?]{1,}$/,
                  message: '请输入正确的密码',
                },
              ]}
            >
              <Input.Password
                disabled={formData.disabled}
                placeholder="请输入密码"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                addonAfter={<Generator onSubmit={handleChangePassword} />}
              />
            </Form.Item>
          </Card>
          <Form.List name="urls">
            {(fields, { add, remove }) => (
              <Card
                title="应用地址"
                type="inner"
                className="form-card"
                extra={
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    disabled={formData.disabled}
                    onClick={add}
                  >
                    新增URL
                  </Button>
                }
              >
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row justify="space-between" gutter={[16, 16]} key={key}>
                      <Col span={20}>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          fieldKey={[fieldKey, 'value']}
                          rules={[
                            { required: true, message: '请输入URL' },
                            {
                              pattern:
                                /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,
                              message: '请输入正确的URL地址',
                            },
                          ]}
                        >
                          <Input
                            placeholder="例如：https://www.baidu.com"
                            disabled={formData.disabled}
                            width={300}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ marginTop: 4 }}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                </>
                {fields.length <= 0 && (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无数据"
                  />
                )}
              </Card>
            )}
          </Form.List>

          <Form.List name="other">
            {(fields, { add, remove }) => (
              <Card
                title="自定义字段"
                type="inner"
                className="form-card"
                extra={
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    disabled={formData.disabled}
                    onClick={add}
                  >
                    新增字段
                  </Button>
                }
              >
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex' }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'otherLabel']}
                        fieldKey={[fieldKey, 'otherLabel']}
                        rules={[{ required: true, message: '请输入字段名称' }]}
                      >
                        <Input placeholder="请输入字段名称" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'otherValue']}
                        fieldKey={[fieldKey, 'otherValue']}
                        rules={[{ required: true, message: '请输入字段内容' }]}
                      >
                        <Input placeholder="请输入字段内容" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                </>
                {fields.length <= 0 && (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无数据"
                  />
                )}
              </Card>
            )}
          </Form.List>

          <Card title="备注" type="inner" className="form-card">
            <Form.Item name="remarks">
              <Input.TextArea
                showCount
                maxLength={100}
                disabled={formData.disabled}
              />
            </Form.Item>
          </Card>
        </Form>
      </div>

      <FormSubmit space>
        {formData.type !== 'delete' && (
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
        )}
        {formData.type === 'delete' && (
          <Popconfirm
            title="是否恢复数据？"
            onConfirm={onrecovery}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary">恢复</Button>
          </Popconfirm>
        )}
        {(formData.type === 'detail' || formData.type === 'delete') && (
          <Popconfirm
            title="是否进行删除？"
            onConfirm={ondel}
            okText="确定"
            cancelText="取消"
          >
            <Button danger>删除</Button>
          </Popconfirm>
        )}
        {formData.type !== 'delete' && <Button onClick={oncancel}>取消</Button>}
      </FormSubmit>
    </div>
  );
}

FormNode.defaultProps = {
  onsubmit: () => {},
  ondel: () => {},
  oncancel: () => {},
  onrecovery: () => {},
};
