import React, { useState } from 'react';
import { Button, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PlusOutlined } from '@ant-design/icons';
import FormSubmit from '../FormSubmit';
import ListItem from '../ListItem';
import './index.css';

type UrlsType = {
  value: string;
};

type OtherType = {
  otherLabel: string;
  otherValue: string;
};

type MainPasswordType = {
  data: string;
  type: 'Buffer' | 'String';
};

export type DataType = {
  id?: number;
  creatTime?: number;
  updateTime?: number;
  projecttype?: string;
  projectname?: string;
  username?: string;
  mainPassword: MainPasswordType;
  urls?: UrlsType[];
  other?: OtherType[];
  remarks?: string;
  isDel?: boolean;
};

interface Props {
  dataSource: DataType[];
  onsearch?: (item: string) => void;
  ondetail?: (item: DataType) => void;
  onadd?: () => void;
}

export default function ListNode(props: Props) {
  const [inputValue, setInputValue] = useState<string>('');
  const { dataSource, onsearch, ondetail, onadd } = props;

  const hasAddButton = typeof onadd === 'function';

  return (
    <div className="List">
      <div className="list-search-box">
        <Input
          allowClear
          placeholder="请输入关键字"
          className="list-search"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            setInputValue(value);

            if (onsearch) {
              onsearch(value);
            }
          }}
        />
      </div>
      <div
        className="list-data-box"
        id="scrollableDiv"
        style={{ bottom: hasAddButton ? 50 : 0 }}
      >
        <InfiniteScroll
          dataLength={dataSource.length}
          scrollableTarget="scrollableDiv"
          next={() => {}}
          hasMore={false}
          loader={undefined}
        >
          <ListItem dataSource={dataSource} ondetail={ondetail} />
        </InfiniteScroll>
      </div>

      {hasAddButton && (
        <FormSubmit>
          <Button type="primary" block onClick={onadd}>
            <PlusOutlined />
          </Button>
        </FormSubmit>
      )}
    </div>
  );
}

ListNode.defaultProps = {
  onsearch: null,
  ondetail: null,
  onadd: null,
};
