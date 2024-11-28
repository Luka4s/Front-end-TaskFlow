/* eslint-disable react-hooks/exhaustive-deps */
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { TaskListProps, useTask } from "../../context/contextAPI";
import { CardTask } from "./components/cardTask";
import { Textarea } from "../../components/ui/textarea";
import { toast, Toaster } from "sonner";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import { CredentialsProps } from "../auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

export function List() {
  const {
    taskList,
    titleTask,
    contentTask,
    isChecked,
    itensInTask,
    isAuthenticate,
    setTaskList,
    setTitleTask,
    setContentTask,
    setItensInTask,
  } = useTask();

  const [filteredList, setFilteredList] = useState<TaskListProps[]>([]);
  const [taskListCheck, setTaskListCheck] = useState(0);
  const [countTasks, setCountTasks] = useState(0);
  const [nameProfile, setNameProfile] = useState("");
  const [idProfile, setIdProfile] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserCredentials = localStorage.getItem("user");

    const userCredentials: CredentialsProps = getUserCredentials
      ? JSON.parse(getUserCredentials)
      : null;

    setNameProfile(userCredentials.userName);
    setIdProfile(userCredentials.userId);

    async function handleGetTasks() {
      if (isAuthenticate) {
        try {
          const response = await api.get(`/${userCredentials.userId}`);
          const tasks = response.data;
          setTaskList(tasks);
          setCountTasks(tasks.length);

          const checkedTasksCount = tasks.filter(
            (task: TaskListProps) => task.checkedTask
          ).length;
          setTaskListCheck(checkedTasksCount);

          if (response.data.itensInTask) {
            const parsedItensInTask =
              typeof response.data.itensInTask === "string"
                ? JSON.parse(response.data.itensInTask)
                : response.data.itensInTask;
            setItensInTask(parsedItensInTask);
          }
        } catch (error) {
          console.error("Ocorreu um erro na busca dos itens !", error);
          toast.error("Ocorreu um erro na busca dos itens !");
        }
      } else {
        navigate("/");
      }
    }

    handleGetTasks();
  }, [isAuthenticate, navigate]);

  async function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const creationDate = new Date();
      const actualDate = format(new Date(creationDate), "yyyy/MM/dd  HH:mm:ss");

      const response = await api.post("/register-task", {
        user_id: idProfile,
        checkedTask: isChecked,
        titleTask: titleTask,
        contentTask: contentTask,
        itensInTask: itensInTask?.length ? itensInTask : [],
        created_at: actualDate,
      });

      setTaskList([
        ...taskList,
        {
          id: response.data.id,
          checkedTask: isChecked,
          titleTask: titleTask,
          contentTask: contentTask,
          itensInTask: itensInTask,
        },
      ]);

      setCountTasks(countTasks + 1);

      toast.success("Tarefa criada com sucesso !");
    } catch (error) {
      console.error("Ocorreu um erro na criação da tarefa !", error);
      toast.warning("Ocorreu um erro na criação da tarefa !");
    }

    setTitleTask("");
    setContentTask("");
  }

  async function handleRemoveTask(taskId: number) {
    try {
      await api.delete(`/${taskId}`);

      const newArray = taskList.filter((item) => item.id !== taskId);
      setTaskList(newArray);

      setTaskListCheck((valueState: number) => {
        if (valueState === 0) {
          return 0;
        } else {
          return valueState - 1;
        }
      });

      setCountTasks(countTasks - 1);
      toast.success("Tarefa excluída com sucesso !");
    } catch (error) {
      console.log("Ocorreu um erro na tentativa de excluir a atividade !");
    }
  }

  async function handleUpdateTask(taskToUpdate: TaskListProps) {
    try {
      await api.patch(`/update-task/${taskToUpdate.id}`, {
        checkedTask: taskToUpdate.checkedTask,
        titleTask: taskToUpdate.titleTask,
        contentTask: taskToUpdate.contentTask,
        itensInTask: taskToUpdate.itensInTask,
      });

      const updateTask = taskList.map((item) => {
        if (item.id === taskToUpdate.id) {
          return {
            ...item,
            titleTask: taskToUpdate.titleTask,
            contentTask: taskToUpdate.contentTask,
            itensInTask: taskToUpdate.itensInTask,
          };
        } else {
          return item;
        }
      });

      setTaskList(updateTask);
    } catch (error) {
      toast.error("Ocorreu um erro !");
      console.log("Ocorreu um erro !", error);
    }
  }

  async function handleCheckedTask(taskId: number) {
    console.log("rodou", taskId);
    try {
      await api.patch(`/update-task/${taskId}`, {
        checkedTask: true,
      });

      setTaskList((prevTaskList: TaskListProps[]) => {
        return prevTaskList.map((item) => {
          if (item.id === taskId) {
            return {
              ...item,
              checkedTask: true,
            };
          } else {
            return item;
          }
        });
      });
      console.log("Try", taskList);

      toast.success("Tarefa marcada como concluída.");
      setTaskListCheck(taskListCheck + 1);
    } catch (error) {
      toast.error("Erro ao marcar a tarefa como concluída.");
      console.log("Ocorreu um erro !", error);
      console.log("catch", taskList);
    }
  }

  async function handleSearchTask(taskSearch: string) {
    try {
      await api.get(`/searchTask/${taskSearch}`);

      const newfilteredlist = taskList.filter((item) =>
        item.titleTask.includes(taskSearch)
      );

      setFilteredList(newfilteredlist);
    } catch (error) {
      toast.error("Erro ao buscar item !");
    }
  }

  function handleUserLogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className=" flex flex-col items-center space-y-9 text-zinc-100 h-screen">
        <div className="border-2 border-t-0 border-l-0 border-r-0 flex justify-end w-full p-4 items-center">
          <h1 className="text-xl text-end">
            Usuario: {nameProfile ? nameProfile : "Desconhecido"}
          </h1>
          <Button onClick={handleUserLogOut}>
            <LogOut className="text-red-600 hover:text-red-300" />
          </Button>
        </div>
        <div className="space-y-9 flex flex-col w-80">
          <Accordion type="single" collapsible>
            <AccordionItem value={"item-1"}>
              <AccordionTrigger>
                <span className="flex justify-between  w-full">Cadastro</span>
              </AccordionTrigger>
              <form
                onSubmit={handleAddTask}
                className="flex flex-col space-y-3 "
              >
                <AccordionContent className="flex flex-col w-full space-y-2">
                  <label htmlFor="title" className="text-lg">
                    Título da nova atividade:
                  </label>
                  <Input
                    type="text"
                    id="title"
                    className="text-black rounded-lg border-2 border-muted-foreground  bg-white "
                    value={titleTask}
                    onChange={(e) => setTitleTask(e.target.value)}
                    required
                  />

                  <label htmlFor="contentTask" className="text-base">
                    Digite o conteúdo da nova atividade:
                  </label>
                  <Textarea
                    id="contentTask"
                    className="text-black border-muted-foreground resize-none"
                    value={contentTask}
                    onChange={(e) => setContentTask(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant={"ghost"}
                    className="bg-emerald-600 text-zinc-50"
                  >
                    Criar uma nova atividade
                  </Button>
                </AccordionContent>
              </form>
            </AccordionItem>
          </Accordion>

          {/*  <form onSubmit={handleAddTask} className="flex flex-col space-y-3">
            <label htmlFor="title" className="text-lg">
              Título da nova atividade:
            </label>
            <Input
              type="text"
              id="title"
              className="text-black rounded-lg border-2 border-muted-foreground  bg-white "
              value={titleTask}
              onChange={(e) => setTitleTask(e.target.value)}
              required
            />

            <label htmlFor="contentTask" className="text-base">
              Digite o conteúdo da nova atividade:
            </label>
            <Textarea
              id="contentTask"
              className="text-black border-muted-foreground resize-none"
              value={contentTask}
              onChange={(e) => setContentTask(e.target.value)}
            />
            <Button
              type="submit"
              variant={"ghost"}
              className="bg-emerald-600 text-zinc-50"
            >
              Criar uma nova atividade
            </Button>
          </form> */}

          <Accordion type="single" collapsible>
            <AccordionItem value={"item-1"}>
              <AccordionTrigger>
                <span className="flex justify-between  w-full">
                  {" "}
                  Buscar tarefa
                  <Search />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Input
                  type="text"
                  id="search"
                  placeholder="Digite o título da tarefa"
                  className="text-black bg-white border-muted-foreground"
                  onChange={(e) => handleSearchTask(e.target.value)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col space-y-2  p-2  w-full text-center md:flex md:flex-row md:justify-evenly md:items-center">
          <span className="text-sm">
            Quantidade de Atividades criadas: {countTasks}
          </span>
          <span className="text-sm">
            Atividades concluidas: {taskListCheck}
          </span>
        </div>
        <div className="flex flex-col items-center space-y-3 w-80 h-52 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-corner-inherit scrollbar-none scrollbar-thumb-muted-foreground scrollbar-track-transparent overflow-y-scroll">
          {filteredList.length > 0 ? (
            <>
              {filteredList.map((item) => {
                return (
                  <div key={item.id}>
                    <CardTask
                      id={item.id}
                      title={item.titleTask}
                      content={item.contentTask}
                      itensInTask={item.itensInTask}
                      checked={item.checkedTask}
                      createdAt={item.created_at}
                      handleUpdateTask={handleUpdateTask}
                      handleRemoveTask={handleRemoveTask}
                      handleCheckedTask={handleCheckedTask}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {taskList.map((item) => {
                return (
                  <div key={item.id}>
                    <CardTask
                      id={item.id}
                      title={item.titleTask}
                      content={item.contentTask}
                      checked={item.checkedTask}
                      createdAt={item.created_at}
                      itensInTask={item.itensInTask}
                      handleUpdateTask={handleUpdateTask}
                      handleRemoveTask={handleRemoveTask}
                      handleCheckedTask={handleCheckedTask}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
