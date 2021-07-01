import { useEffect, useState } from "react";

// 在函数里，改变传入对象是不好的

//将0转变为不为false
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);
//!!两个感叹号 对反求反 转变为布尔值

export const cleanObject = (object: object) => {
  // Object.assign({}, object)
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    //@ts-ignore
    const value = result[key];
    //如果value为false，包括undefined unll
    //排除传入值为0的情况
    if (isFalsy(value)) {
      //@ts-ignore
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
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
