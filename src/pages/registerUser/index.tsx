import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/axios";
import { FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { format } from "date-fns";
import { AxiosError } from "axios";

export function RegisterUser() {
  const [userName, setUserName] = useState("");
  const [userLogin, setUserLogin] = useState("");
  const [userErrorExist, setUserErrorExist] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (userName.trim().length <= 1) {
        toast.warning("O nome de usuário deve conter 2 ou mais caracteres");
        return;
      }

      const actualDate = format(new Date(), "yyyy/MM/dd  HH:mm:ss");

      await api.post("/create-users", {
        user_Name: userName,
        user_Login: userLogin,
        created_at: actualDate,
      });

      toast.success("Usuario cadastrado com sucesso !");

      setUserErrorExist(false);
      setUserName("");
      setUserLogin("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          console.log(error.response.data.message);
          return setUserErrorExist(true);
        }
      }
    }
  }

  return (
    <>
      <Toaster position={"top-center"} richColors />
      <div className="flex flex-col  text-zinc-50 bg-zinc-800 h-screen">
        <div className="flex items-start"></div>
        <div className="flex flex-col  text-zinc-50 bg-zinc-800 h-screen items-center justify-center">
          <div className="flex flex-col space-y-8 bg-neutral-600 rounded-lg p-4 border-2 border-muted-foreground">
            <span>Para cadastrar um usuário preencha as informações:</span>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <label htmlFor="userLogin" className="cursor-pointer">
                Login de acesso:
              </label>
              <Input
                type="text"
                name="userLogin"
                id="userLogin"
                required
                onChange={(e) => setUserLogin(e.target.value)}
              />

              <label htmlFor="userName" className="cursor-pointer ">
                Nome de usuário:
              </label>
              <Input
                type="text"
                name="userName"
                id="userName"
                required
                onChange={(e) => setUserName(e.target.value)}
              />

              <div className="flex flex-col  items-center gap-2">
                <span className="text-sm  text-red-500 text-center">
                  {userErrorExist &&
                    "O login informado já está sendo utilizado, porfavor insira outro login!"}
                </span>
                <Button type="submit" className="w-full">
                  Cadastrar
                </Button>
                <NavLink to={"/"}>
                  {" "}
                  <Button variant={"secondary"}>Voltar</Button>
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
