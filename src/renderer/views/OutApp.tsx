import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { message } from 'antd';
import ListItem from '../components/ListItem';
import { DataType } from '../components/List';
import * as API from '../api';

export default function OutWindow() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const getListHeigth = useRef<HTMLDivElement>(null);

  async function handleSearch(value?: string) {
    const result: any = await API.get('GET_SEARCH_LIST', value, {
      noVerification: true,
    });

    if (result.code === 0) {
      const data = result.data || [];

      setDataSource([...data]);
    }
    // 未登录关闭窗口
    if (result.code === 999) {
      window.secretfns.CLOSE_SEARCH_WINDOW();
    }
  }

  useEffect(() => {
    inputRef.current?.focus();

    inputRef.current?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        inputRef.current?.blur();
      }
    });
  }, []);

  useEffect(() => {
    window.secretfns.CHANGR_WINDOW_HEIGHT({
      height: getListHeigth.current?.clientHeight,
    });
  }, [dataSource]);

  return (
    <div className="outwindow" ref={getListHeigth}>
      <div className="win-input-box">
        <div className="input">
          <input
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value: string = e.target.value;
              setInputValue(value);

              if (value) {
                handleSearch(value);
              } else {
                setDataSource([]);
              }
            }}
          />
        </div>
        <div className="icon"></div>
      </div>

      {dataSource.length > 0 && (
        <ListItem
          dataSource={dataSource}
          isHover={true}
          ondetail={(item) => {
            window.secretfns.CLIPBOARD_DATA(item.mainPassword);

            message.success('密码复制成功');
          }}
        />
      )}
    </div>
  );
}
