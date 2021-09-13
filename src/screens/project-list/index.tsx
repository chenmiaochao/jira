import { useEffect, useState } from 'react';
import { SearchPanel } from './search-panel';
import { List } from './list';
import * as qs from 'qs';
import { cleanObject, useDebounce, useMount } from 'utils';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [users, setUsers] = useState([]);

  const [param, setParam] = useState({
    name: '',
    personId: '',
  });
  const debouncedParam = useDebounce(param, 200);
  const [list, setList] = useState([]);
  const client = useHttp();

  useEffect(() => {
    client('projects', { data: cleanObject(debouncedParam) }).then(setList);
  }, [debouncedParam]);

  useMount(() => {
    client('users').then(setUsers);
  });
  return (
    <Container>
      <SearchPanel param={param} setParam={setParam} users={users} />
      <List list={list} users={users} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
