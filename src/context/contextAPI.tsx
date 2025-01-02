import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ITaskContext {
  taskList: TaskListProps[];
  userLogin: string;
  titleTask: string;
  contentTask: string;
  isChecked: boolean;
  itensInTask: ItemInTaskProps[];
  isAuthenticate: boolean;
  setTaskList: Dispatch<SetStateAction<TaskListProps[]>>;
  setUserLogin: (e: string) => void;
  setTitleTask: (e: string) => void;
  setContentTask: (e: string) => void;
  setIsChecked: (e: boolean) => void;
  setItensInTask: Dispatch<SetStateAction<ItemInTaskProps[]>>;
  setIsAuthenticate: (e: boolean) => void;
}

export interface TaskListProps {
  id: number;
  checkedTask: boolean;
  titleTask: string;
  contentTask: string;
  created_at?: string;
  itensInTask: ItemInTaskProps[];
  conclued_step?: ItemInTaskProps[];
}

export interface ItemInTaskProps {
  id: number;
  itens: string;
}

const TaskContext = createContext<ITaskContext | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTask = (): ITaskContext => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("Provider missing!");
  }
  return context;
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [taskList, setTaskList] = useState<TaskListProps[]>([]);
  const [userLogin, setUserLogin] = useState("");
  const [titleTask, setTitleTask] = useState("");
  const [contentTask, setContentTask] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [itensInTask, setItensInTask] = useState<ItemInTaskProps[]>([]);
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  return (
    <TaskContext.Provider
      value={{
        taskList,
        userLogin,
        titleTask,
        contentTask,
        isChecked,
        itensInTask,
        isAuthenticate,
        setTaskList,
        setUserLogin,
        setTitleTask,
        setContentTask,
        setIsChecked,
        setItensInTask,
        setIsAuthenticate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
