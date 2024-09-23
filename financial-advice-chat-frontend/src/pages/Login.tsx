import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/apiRoutes";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await loginUser({ email, password });

      console.log("Usuário autenticado:", response.user);

      navigate("/chat");
    } catch (error) {
      setErrorMessage(
        "Falha ao tentar fazer login. Verifique suas credenciais."
      );
      console.error("Falha no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Exibe mensagem de erro, se houver */}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <div className="flex flex-col space-y-4 mt-4">
            <button
              className={`w-full text-white font-semibold py-2 px-4 rounded-md ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
            <button
              className="w-full text-blue-600 font-semibold py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50"
              type="button"
              onClick={handleGoToRegister}
            >
              Registre-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
