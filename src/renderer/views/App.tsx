import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu, Button, Row, Col, message } from 'antd';
import { router } from '../router';
import * as API from '../api';
import FormSubmit from '../components/FormSubmit';

export default function App() {
  async function handleImport() {
    const result = await API.get('IMPORT_FILE_DATA');

    const res = result.data;

    const content = res.flat(1);

    content
      .map((item: any) => ({
        projecttype: item.type || 'account',
        projectname: item.name,
        username: item.username,
        mainPassword: item.password,
        remarks: item.remarks,
      }))
      .forEach(async (value: any) => {
        await API.get('ADD_DATA', value);
      });

    message.success('导入成功');
  }

  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Layout.Sider>
        <Menu defaultSelectedKeys={['1']} mode="inline" theme="dark">
          {router.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
        {/* <FormSubmit>
          <Row justify="space-between">
            <Col span={10}>
              <Button block type="primary" disabled onClick={handleImport}>
                --
              </Button>
            </Col>
            <Col span={10}>
              <Button block type="primary" disabled>
                --
              </Button>
            </Col>
          </Row>
        </FormSubmit> */}
      </Layout.Sider>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}
