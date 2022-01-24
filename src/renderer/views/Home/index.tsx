import { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import Form, { ShowFormDataType } from '../../components/Form';
import List, { DataType } from '../../components/List';
import * as API from '../../api';

export default function Home() {
  const [showForm, setShowForm] = useState<ShowFormDataType>({
    show: false,
    type: 'add',
    form: {},
  });

  const [passwordList, setPasswordList] = useState<DataType[]>([]);

  async function handleSearch(value?: string) {
    const result = await API.get('GET_SEARCH_LIST', value);

    const data = result.data || [];

    setPasswordList([...data]);
  }

  async function handleSubmit(values: any) {
    const form = showForm.form || {};

    try {
      if (showForm.type === 'add') {
        await API.get('ADD_DATA', values);

        message.success('添加成功');
      } else {
        await API.get('UPDATE_DATA', {
          ...values,
          id: form.id,
        });

        message.success('更新成功');
      }
      setShowForm({
        show: false,
      });

      handleSearch();
    } catch (err) {
      message.success('添加失败');
    }
  }

  async function handleDel() {
    const form = showForm.form || {};

    await API.get('DEL_DATA', form.id);

    setShowForm({
      show: false,
    });

    handleSearch();

    message.success('删除成功');

    setShowForm({
      show: false,
    });
  }

  async function handleDetail(id?: number) {
    const result = await API.get('GET_DATA', id);

    const form = result.data || {};

    setShowForm({
      show: true,
      type: 'detail',
      form,
    });
  }

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Layout>
      <Layout.Sider width={300}>
        <List
          onadd={() => {
            setShowForm({
              show: true,
              type: 'add',
            });
          }}
          onsearch={(value) => {
            handleSearch(value);
          }}
          ondetail={(form) => {
            if (!form.isDel) {
              handleDetail(form.id);
            }
          }}
          dataSource={passwordList}
        />
      </Layout.Sider>
      <Layout>
        {showForm.show && (
          <Form
            onsubmit={handleSubmit}
            oncancel={() =>
              setShowForm({
                show: false,
              })
            }
            ondel={() => handleDel()}
            formData={showForm}
          />
        )}
      </Layout>
    </Layout>
  );
}
