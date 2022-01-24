import { useEffect, useState, useRef } from 'react';
import { List, Space } from 'antd';
import {
  InsuranceOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { DataType } from '../List';
import Mousetrap from 'mousetrap';
import './index.css';

interface PropsType {
  isHover?: boolean;
  ondetail?: (item: DataType) => void;
  dataSource: DataType[];
}

export default function ListItem(props: PropsType) {
  const { dataSource, ondetail, isHover } = props;
  const [itemIndex, setItemIndex] = useState<number>(0);
  const getDataSource = useRef<DataType[]>([]);
  const getItemIndex = useRef<number>(0);

  useEffect(() => {
    if (isHover) {
      Mousetrap.bind(['up', 'down', 'enter'], (e) => {
        const dataLength = getDataSource.current.length - 1;

        if (e.key === 'Enter') {
          ondetail && ondetail(getDataSource.current[getItemIndex.current]);
        }

        if (e.key === 'ArrowDown' && getItemIndex.current < dataLength) {
          setItemIndex((value) => value + 1);
        }

        if (e.key === 'ArrowUp' && getItemIndex.current > 0) {
          setItemIndex((value) => value - 1);
        }
      });
    }

    return () => {
      if (isHover) {
        Mousetrap.unbind(['up', 'down', 'enter']);
      }
    };
  }, []);

  useEffect(() => {
    getDataSource.current = dataSource;
  }, [dataSource]);

  useEffect(() => {
    getItemIndex.current = itemIndex;
  }, [itemIndex]);

  return (
    <List
      dataSource={dataSource}
      renderItem={(item: DataType, index) => (
        <List.Item
          className={
            isHover && index === itemIndex ? 'list-item isHover' : 'list-item'
          }
          onMouseOver={() => {
            if (isHover) {
              setItemIndex(index);
            }
          }}
        >
          <Space
            style={{ width: '100%', cursor: 'pointer' }}
            onClick={() => {
              if (ondetail) {
                ondetail(item);
              }
            }}
          >
            {/* {item.projecttype === 'network' && (
              <GlobalOutlined style={{ fontSize: 24 }} />
            )}
            {item.projecttype === 'account' && (
              <UserOutlined style={{ fontSize: 24 }} />
            )}
            {item.projecttype !== 'account' &&
              item.projecttype !== 'network' && (
                <InsuranceOutlined style={{ fontSize: 24 }} />
              )} */}

            <InsuranceOutlined style={{ fontSize: 24 }} />
            <div className="list-content">
              <div className="projectname">{item.projectname}</div>
              <div className="username">{item.username}</div>
            </div>
          </Space>
        </List.Item>
      )}
    />
  );
}

ListItem.defaultProps = {
  isHover: false,
  ondetail: null,
};
