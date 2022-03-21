import { cleanObject, subset } from 'utils';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

/**
 * 返回页面url中,指定键的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return [
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), keys) as {
          [key in K]: string;
        },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams],
    ),
    // error、因为return的就是["name","personId"]
    //   () =>
    //     keys.reduce((prev: K, key: K) => {
    //       return { ...prev, [key]: searchParams.get[key] || '' };
    //     }, {} as { [key in K]: string }),
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    //   [searchParams],
    // ),
    // 目标: 传入不正确的keys,报错
    // 传入的键值对,key一定要在K里面,值就无所谓
    (params: Partial<{ [key in K]: unknown }>) => {
      // iterator 遍历器
      // [],{},Map都部署了iterator 就是都可以用 for...of
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
      const o = cleanObject({
        ...Object.fromEntries(searchParams), // 将URLSearchParams实例转换为对象
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(o);
    },
  ] as const;
};
