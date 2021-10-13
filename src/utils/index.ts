import { useEffect, useState } from 'react';

// 为什么结构的object类型会被当作空对象?
// let a: object;
// a = () => {};
// a = new RegExp('');

// let b: { [key: string]: unknown };
// b = () =>{} // 会报错
// 在函数里，改变传入对象是不好的

//将0转变为不为false
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);
//!!两个感叹号 对反求反 转变为布尔值

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === '';

export const cleanObject = (object: { [key: string]: unknown }) => {
  // Object.assign({}, object)
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    //如果value为false，包括undefined unll
    //排除传入值为0的情况
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //TODO 依赖项里加上callback会造成无限循环,这个和useCallBack和useMeMo有关系
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
//后面用泛型来规范类型
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debounceValue, setDebonceValue] = useState(value);
  //每次在value变化以后，设置一个定时器
  useEffect(() => {
    const timeout = setTimeout(() => setDebonceValue(value), delay);
    //每次在上一次useEffect处理以后再运行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
};

export const useArray = <T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray);

  return {
    value,
    setValue,
    add: (item: T) => setValue([...value, item]),
    clear: () => setValue([]),
    removeIndex: (index: number) => {
      const copy = [...value];
      copy.slice(index, 1);
      setValue(copy);
    },
  };
};

export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true,
) => {
  const oldTitle = document.title;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, []);
};
