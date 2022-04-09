import { useCallback } from 'react';
import * as auth from 'auth.provider';
import { useAuth } from 'context/auth-context';
import qs from 'qs';

const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  token?: string;
  data?: Object;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {},
) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': data ? 'application/json' : '',
    },
    ...customConfig, //上面默认指定GET，但如果后面传入method就会覆盖
  };

  if (config.method.toUpperCase() === 'GET') {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }
  //axios 和fetch表现不一样，非2XX都能表示异常
  return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (res) => {
    if (res.status === 401) {
      await auth.logout();
      window.location.reload();
      return Promise.reject({ message: '请重新登录' });
    }
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

//js中的typeof是在runtime中运行的
//ts中的typeof是在静态环境运行的
// return typeof 1 === 'number'

export const useHttp = () => {
  const { user } = useAuth();
  // utility type用法：用泛型给它传入一个其它类型，然后utility type对这个类型惊醒某种操作
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token],
  );
};

// 联合类型
// let myFavoriteNunber: string | number;
// myFavoriteNunber = "seven";
// myFavoriteNunber = 7;
//'myFavoriteNunber' is assigned a value but never used.eslint@typescript-eslint/no-unused-vars
// myFavoriteNunber = {}
// let jackFavouriteNumber: string | number;

//类型别名
// type FavouriteNumber = string | number;
// let roseFavouriteNumber: FavouriteNumber = "6";

//类型别名在很多情况下可以和interface呼唤
// interface Person {
//   name: string;
// }
// type Person = {name: string}
// const xiaoming: Person = { name: "xiaoming" };

//类型别名在这种情况下没法替代type
type FavouriteNumber = string | number;
let roseFavouriteNumber: FavouriteNumber = 6;

//interface 也没法实现Utility type
type Person = {
  name: string;
  age: number;
};

const xiaoming: Partial<Person> = { age: 8 };
const shenMiRen: Omit<Person, 'name' | 'age'> = {};
type PersonKeys = keyof Person;
type PersonOnlyName = Pick<Person, 'name'>;

//Partial 的实现
type Partial<T> = {
  [P in keyof T]?: T[P];
};
// 这里的？ 使所有的key都变成了可选 从而实现了Partial
