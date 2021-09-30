import { FormEvent } from 'react';
import { useAuth } from 'context/auth-context';
import { Button, Form, Input } from 'antd';
import { LongButton } from './index';
import { useAsync } from 'utils/useAsync';

export const RegisterScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { register, user } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });

  const handleSubmit = async ({
    cpassword,
    ...values
  }: {
    username: string;
    password: string;
    cpassword: string;
  }) => {
    if (cpassword !== values.password) {
      onError(new Error('请确认两次密码输入相同'));
    }
    // register(value).catch 可以捕捉到 e.message
    // 可是try catch不可以,为什么呢
    // 因为try catch是同步代码,而register是promise,微任务异步
    // try catch执行完了,而register还没执行所有 onError(e)无法设置e,页面也没有显示e.message
    try {
      await run(register(values));
    } catch (e) {
      onError(e);
    }
  };
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={'username'}
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder={'用户名'} type="text" id={'username'} />
      </Form.Item>
      <Form.Item
        name={'password'}
        rules={[
          {
            required: true,
            message: '请输入密码',
          },
        ]}
      >
        <Input placeholder={'密码'} type="password" id={'password'} />
      </Form.Item>
      <Form.Item
        name={'cpassword'}
        rules={[
          {
            required: true,
            message: '请输入密码',
          },
        ]}
      >
        <Input placeholder={'确认密码'} type="password" id={'cpassword'} />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType={'submit'} type={'primary'}>
          注册
        </LongButton>
      </Form.Item>
    </Form>
  );
};
