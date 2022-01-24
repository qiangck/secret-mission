import { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import List, { DataType } from '../../components/List';
import Form, { ShowFormDataType } from '../../components/Form';
import * as API from '../../api';

export default function Recycle() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [showForm, setShowForm] = useState<ShowFormDataType>({
    show: false,
    type: 'add',
    form: {},
  });

  async function handleSearch(value?: string) {
    const result = await API.get('GET_BIN_LIST', value);

    const data = result.data || [];

    setDataSource([...data]);
  }
  async function handleRecovery() {
    const form = showForm.form || {};

    await API.get('UPDATE_DATA', { ...form, isDel: false, id: form.id });

    handleSearch();

    message.success('恢复成功');

    setShowForm({
      show: false,
    });
  }

  async function handleDelete() {
    const form = showForm.form || {};

    await API.get('DEL_DATA_PHYSICS', form.id);

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
      type: 'delete',
      form,
      disabled: true,
    });
  }

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Layout>
      <Layout.Sider width={300}>
        <List
          onsearch={(value) => {
            handleSearch(value);
          }}
          ondetail={(form) => {
            if (form.isDel) {
              handleDetail(form.id);
            }
          }}
          dataSource={dataSource}
        />
      </Layout.Sider>
      <Layout>
        {showForm.show && (
          <Form
            oncancel={() =>
              setShowForm({
                show: false,
              })
            }
            ondel={() => handleDelete()}
            onrecovery={() => handleRecovery()}
            formData={showForm}
          />
        )}
      </Layout>
    </Layout>
  );
}
