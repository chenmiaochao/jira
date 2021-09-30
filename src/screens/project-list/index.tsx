import { useEffect, useState } from 'react';
import { SearchPanel } from './search-panel';
import { List } from './list';
import * as qs from 'qs';
import { cleanObject, useDebounce, useMount } from 'utils';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';
import { Typography } from 'antd';

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const [param, setParam] = useState({
    name: '',
    personId: '',
  });
  const debouncedParam = useDebounce(param, 200);
  const [list, setList] = useState([]);
  const client = useHttp();

  useEffect(() => {
    setIsLoading(true);
    client('projects', { data: cleanObject(debouncedParam) })
      .then(setList)
      .catch((error) => {
        setError(error);
        setList([]);
      })
      .finally(() => setIsLoading(false));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedParam]);

  useMount(() => {
    client('users').then(setUsers);
  });
  return (
    <Container>
      <SearchPanel param={param} setParam={setParam} users={users} />
      {error ? (
        <Typography.Text type={'danger'}>{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} users={users} dataSource={list} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
