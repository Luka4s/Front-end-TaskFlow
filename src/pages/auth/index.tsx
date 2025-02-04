import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useTask } from "../../context/contextAPI";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";
import { FormEvent, useEffect } from "react";
import { api } from "../../lib/axios";
import { Input } from "../../components/ui/input";

export interface CredentialsProps {
  userName: string;
  userId: number;
}

export function SignIn() {
  const { userLogin, setIsAuthenticate, setUserLogin } = useTask();
  const navigate = useNavigate();

  function handleSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    handleAuthUser();
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate(`/`);
      setIsAuthenticate(true);
    } else {
      navigate("/login");
      setIsAuthenticate(false);
    }
  }, [navigate, setIsAuthenticate]);

  async function handleAuthUser() {
    try {
      const response = await api.get(`/login/${userLogin}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Login efetuado com sucesso!");

        setIsAuthenticate(true);

        const saveUserCredentials: CredentialsProps = {
          userName: response.data.user_Name,
          userId: response.data.user_id,
        };

        localStorage.setItem("user", JSON.stringify(saveUserCredentials));

        setTimeout(() => {
          navigate(`/`);
        }, 2000);
      } else if (response.status === 401) {
        toast.error("Cadastro não encontrado !");
        setIsAuthenticate(false);
        navigate("/login");
      }
    } catch (error) {
      toast.error("Cadastro não encontrado !");
    }
  }

  return (
    <>
      <div className="flex flex-col  h-screen  items-center  justify-center  bg-zinc-900 sm:grid sm:grid-cols-2 sm:bg-zinc-800">
        <div className="text-center mt-8 md:flex md:flex-col ">
          <div className="flex justify-center text-2xl font-semibold gap-2 p-2 items-center text-zinc-50">
            <h1 className="font-mono">TASKFLOW - SUA LISTA DINÁMICA</h1>
          </div>
          <span className="font-mono font-semibold text-xl gap-2 text-zinc-50 ">
            Tudo em um só lugar.
          </span>
        </div>
        <div className="flex flex-col space-y-4 justify-center items-center bg-zinc-900 text-zinc-50  h-full ">
          <form
            onSubmit={(e) => handleSubmitForm(e)}
            className="flex flex-col items-center space-y-5 border-2 rounded-lg p-4"
          >
            <span className="text-lg">Digite seu usuario cadastrado</span>
            <Input
              type="text"
              className="text-black bg-zinc-50"
              placeholder="Digite aqui seu login"
              onChange={(e) => setUserLogin(e.target.value)}
            />
            <div>
              <Toaster richColors />
              <Button type="submit" variant={"ghost"} className="bg-zinc-800">
                Acessar
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <span>caso ainda não tenha uma conta.</span>
              <NavLink to={"/register"} className="underline">
                cadastrar conta
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
