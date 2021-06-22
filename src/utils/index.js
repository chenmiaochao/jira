// 在函数里，改变传入对象是不好的
export const isFalsy = (value) => (value === 0 ? false : !value);
//!!两个感叹号 对反求反 转变为布尔值

export const cleanObject = (object) => {
  // Object.assign({}, object)
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    //如果value为false，包括undefined unll
    //排除传入值为0的情况
    if (isFalsy(value)) {
      delete result[key];
    }
  });
  return result;
};
