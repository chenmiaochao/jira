import { Table, TableProps } from 'antd';
import { User } from './search-panel';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Pin } from 'components/pin';
import { useEditProject } from 'utils/project';
// react-router和react-route-dom的关系, 类似于 react 和 react-dom/react-native/react-vr

//TODO把所有id转number
export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
}

interface ListProps extends TableProps<Project> {
  users: User[];
  refresh?: () => void;
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject();
  // before 柯里化
  // const editPinProject = (id: number, pin: boolean) => mutate({id, pin})
  // 柯里化
  // 因为project.id先知道,所以首先消化id
  // 然后再消化晚一点得到的 pin
  const editPinProject = (id: number) => (pin: boolean) =>
    mutate({ id, pin }).then(props.refresh);
  return (
    <Table
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                // before柯里化
                // 首先两个传入值,获取时机不相同
                // project.id是在render的时候获得
                // pin是在onChange的时候获得
                // 于是跳回上面定义editPinProject
                // onCheckedChange={(pin) => {
                //   editPinProject({ project.id, pin });
                // }}
                // 柯里化
                onCheckedChange={editPinProject(project.id)}
              />
            );
          },
        },
        {
          title: '名称',
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: '部门',
          dataIndex: 'organization', // 读取name属性
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: '负责人',
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  '未知'}
              </span>
            );
          },
        },
        {
          title: '创建时间',
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format('YYYY-MM-DD')
                  : '无'}
              </span>
            );
          },
        },
      ]}
      {...props}
    ></Table>
  );
};
