import { useState, useEffect } from 'react';
import { Layout, Card, Descriptions, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import Modify from '../../components/Modify';
import * as API from '../../api';

export default function Settings() {
  const contentStyle = { width: '100%', height: '100vh', padding: 20 };
  const cardStyle = { width: '100%', height: '100%' };
  const [userinfo, setUserinfo] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetch = async () => {
    const result = await API.get('GET_USER_INFO');

    const data = result.data || {};

    setUserinfo(data);
  };

  const handleOk = async (values: any) => {
    await API.get('USER_PASSWORD_MODIFY', values);

    message.success('修改密码成功');

    setIsModalVisible(false);

    navigate('/login', { replace: true });
  };

  const handleOutLogin = () => {
    Modal.confirm({
      content: '确认注销当前用户',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await window.secretfns.CLEAR_LOGIN_STATUS();

        message.success('登录已注销');

        navigate('/login', { replace: true });
      },
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Layout>
      <Layout.Content style={contentStyle}>
        <Card title="设置" bordered={false} style={cardStyle}>
          <Descriptions title="账号">
            <Descriptions.Item label="账号">
              {userinfo.username}
              <a
                style={{ marginLeft: 10 }}
                type="link"
                onClick={handleOutLogin}
              >
                退出登录
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">{userinfo.email}</Descriptions.Item>
            <Descriptions.Item label="密码">
              <a
                type="link"
                onClick={() => {
                  setIsModalVisible(true);
                }}
              >
                修改
              </a>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Layout.Content>

      <Modify
        visible={isModalVisible}
        handleOk={handleOk}
        handleCancel={() => {
          setIsModalVisible(false);
        }}
      />
    </Layout>
  );
}
