import React from 'react';
import { useState } from 'react';
import { SearchPanel } from './search-panel';
import { List } from './list';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useProject } from 'utils/project';
import { useUsers } from 'utils/user';
import { useDebounce, useDocumentTitle } from 'utils';
import { useUrlQueryParam } from 'utils/url';

export const ProjectListScreen = () => {
  // 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里
  // https://codesandbox.io/s/keen-wave-tlz9s?file=/src/App.js
  const [param, setParam] = useUrlQueryParam(['name', 'personId']);
  const debouncedParam = useDebounce(param, 200);
  //取出data, :list 改名list
  const { isLoading, error, data: list } = useProject(debouncedParam);
  const { data: users } = useUsers();

  useDocumentTitle('项目列表', false);

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      {error ? (
        <Typography.Text type={'danger'}>{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};
ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
