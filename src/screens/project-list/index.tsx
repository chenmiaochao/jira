import React from 'react';
import { useState } from 'react';
import { SearchPanel } from './search-panel';
import { List } from './list';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useProject } from 'utils/project';
import { useUsers } from 'utils/user';
import { useDebounce, useDocumentTitle } from 'utils';
import { useProjectSearchParams } from './util';

// 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里
// https://codesandbox.io/s/keen-wave-tlz9s?file=/src/App.js

export const ProjectListScreen = () => {
  useDocumentTitle('项目列表', false);
  const [param, setParam] = useProjectSearchParams();
  //取出data, :list 改名list
  const { isLoading, error, data: list } = useProject(useDebounce(param, 200));
  const { data: users } = useUsers();

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
ProjectListScreen.whyDidYouRender = true;

const Container = styled.div`
  padding: 3.2rem;
`;
