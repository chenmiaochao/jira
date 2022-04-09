import { useHttp } from './http';
import { useAsync } from './use-async';
import { Project } from 'screens/project-list/list';
import { useEffect } from 'react';
import { cleanObject } from 'utils';

//传入的参数是Peoject的一部分{name, presonId}
export const useProject = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  const fetchProjects = () =>
    client('projects', { data: cleanObject(param || {}) });

  useEffect(() => {
    run(fetchProjects(), {
      retry: fetchProjects,
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return result;
};

// 这里什么都不传, 在jsx里不可以直接调用hook
export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`project/${params.id}`, {
        data: params,
        method: 'PATCH',
      }),
    );
  };
  return {
    mutate,
    ...asyncResult,
  };
};

export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`project/${params.id}`, {
        data: params,
        method: 'POST',
      }),
    );
  };
  return {
    mutate,
    ...asyncResult,
  };
};
