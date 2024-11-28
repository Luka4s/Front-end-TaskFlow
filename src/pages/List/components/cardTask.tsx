import { Check, PencilIcon, Plus, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  ItemInTaskProps,
  TaskListProps,
  useTask,
} from "../../../context/contextAPI";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { Input } from "../../../components/ui/input";
import { format } from "date-fns";

interface CardTaskProps {
  id: number;
  title: string;
  content: string;
  checked: boolean;
  itensInTask: ItemInTaskProps[];
  createdAt?: string;
  handleRemoveTask: (taskId: number) => void;
  handleUpdateTask: (taskToUpdate: TaskListProps) => void;
  handleCheckedTask: (check: number) => void;
}

export function CardTask({
  id,
  title,
  content,
  itensInTask,
  checked,
  createdAt,
  handleRemoveTask,
  handleUpdateTask,
  handleCheckedTask,
}: CardTaskProps) {
  useEffect(() => {
    let formattedList: ItemInTaskProps[] = [];

    if (typeof itensInTask === "string") {
      try {
        formattedList = JSON.parse(itensInTask);
      } catch (error) {
        console.error("Erro ao converter dados !", error);
      }
    } else if (Array.isArray(itensInTask)) {
      formattedList = itensInTask;
    }

    setListItens(formattedList);
  }, [itensInTask]);

  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);

  const [textItemInTask, setTextItemInTask] = useState("");
  const [listItens, setListItens] = useState<ItemInTaskProps[]>([]);

  const transformDate = createdAt && new Date(createdAt);

  const createDate = transformDate
    ? format(new Date(transformDate), "dd/MM/yyyy 'ás' HH:mm:ss")
    : "Data não encontrada !";

  const { isChecked } = useTask();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleUpdateTask({
      id,
      checkedTask: isChecked,
      titleTask: newTitle,
      contentTask: newContent,
      itensInTask: listItens,
    });
  }

  function handleAddItemInTask() {
    if (textItemInTask.length > 0) {
      const addingNewItemInList = [
        ...listItens,
        { id: listItens.length + 1, itens: textItemInTask.trim() },
      ];
      setListItens(addingNewItemInList);
      setTextItemInTask("");
    }
  }
  function handleRemoveItemInTask(itemId: number) {
    const listOfFilteredItems = listItens.filter((item) => item.id !== itemId);
    setListItens(listOfFilteredItems);
  }

  return (
    <>
      <div className="flex w-64 p-3 rounded-lg border-2 border-muted-foreground bg-slate-100 text-black">
        <div className="flex flex-1 justify-between text-center items-center">
          <input
            type="radio"
            onChange={() => handleCheckedTask(id)}
            checked={checked === true}
          />
          <h1>{title}</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger>
                <PencilIcon size={20} className="hover:text-sky-600" />
              </DialogTrigger>
              <DialogContent
                className="flex flex-col"
                aria-describedby={undefined}
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-1 flex-col space-y-2 "
                >
                  <Accordion
                    type="single"
                    collapsible
                    className="flex flex-col  "
                  >
                    <AccordionItem value={"item-1"}>
                      <DialogTitle>
                        <AccordionTrigger className="underline">
                          Informações de cadastro:
                        </AccordionTrigger>
                      </DialogTitle>
                      <AccordionContent className="flex flex-col space-y-2">
                        <div>
                          <span>Data de criação: {createDate} </span>
                        </div>
                        <DialogHeader>
                          <div className="flex flex-col text-nowrap w-2/4 space-y-2">
                            <DialogTitle>
                              <span>Alterar titulo da atividade</span>
                            </DialogTitle>
                            <input
                              type="text"
                              name="title"
                              className="border-2 border-muted-foreground rounded-lg p-1"
                              defaultValue={title}
                              onChange={(e) => setNewTitle(e.target.value)}
                            />
                          </div>
                          <DialogDescription className="text-start">
                            <span className="text-black">
                              Adicione aqui suas anotações:
                            </span>
                          </DialogDescription>
                        </DialogHeader>

                        <Textarea
                          className="w-full border-muted-foreground scrollbar-none "
                          defaultValue={content}
                          onChange={(e) => setNewContent(e.target.value)}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex w-full justify-between items-center p-1 gap-2 border-2 border-muted-foreground rounded-lg hover:cursor-pointer">
                    <Input
                      type="text"
                      placeholder="Adicionar um novo item"
                      className="flex-1 h-full text-center border-none focus:border-none"
                      value={textItemInTask}
                      onChange={(e) => {
                        setTextItemInTask(e.target.value);
                      }}
                    />
                    <Button
                      type="submit"
                      className="text-emerald-500 border-2  border-emerald-500  hover:bg-emerald-700 hover:text-zinc-50"
                      variant={"ghost"}
                      onClick={() => handleAddItemInTask()}
                    >
                      <Plus className="size-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col w-full h-40 space-y-2  scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-corner-inherit scrollbar-none scrollbar-thumb-muted-foreground scrollbar-track-transparent overflow-y-scroll">
                    {listItens?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between border-2 border-muted-foreground rounded-lg p-2"
                        >
                          <span>{item.itens}</span>
                          <div
                            onClick={() => handleRemoveItemInTask(item.id)}
                            className="hover:cursor-pointer size-6 border-2 rounded-full border-emerald-500 hover:border-emerald-800 hover:bg-emerald-800"
                          >
                            <Check className="size-5 text-emerald-500 hover:text-emerald-50" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center">
                    <DialogClose asChild>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-800"
                      >
                        Salvar
                      </Button>
                    </DialogClose>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Popover>
              <PopoverTrigger>
                <Trash2
                  size={20}
                  className="cursor-pointer text-red-600 hover:text-red-800"
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col space-y-4 ">
                  <span className="text-lg text-center">
                    Você deseja excluir essa atividade ?
                  </span>
                  <PopoverClose
                    className="flex items-center justify-around"
                    asChild
                  >
                    <div>
                      <Button
                        onClick={() => handleRemoveTask(id)}
                        className="bg-red-600 hover:bg-red-900"
                      >
                        Excluir
                      </Button>
                      <Button className="bg-emerald-600 text-zinc-50 hover:bg-emerald-800">
                        Cancelar
                      </Button>
                    </div>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}
