import { useHttp } from './http';
import { useAsync } from './useAsync';
import { Project } from 'screens/project-list/list';
import { useEffect } from 'react';
import { cleanObject } from 'utils';

//传入的参数是Peoject的一部分{name, presonId}
export const useProject = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();

  useEffect(() => {
    run(client('projects', { data: cleanObject(param || {}) }));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return result;
};
