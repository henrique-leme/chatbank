import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterData, registerUser } from "../api/apiRoutes";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    secondName: z.string().min(1, "Sobrenome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    age: z
      .number({
        required_error: "Idade é obrigatória",
        invalid_type_error: "Idade deve ser um número",
      })
      .positive("Idade deve ser um número positivo"),
    income: z
      .number({
        required_error: "Renda é obrigatória",
        invalid_type_error: "Renda deve ser um número",
      })
      .nonnegative("Renda deve ser um número não negativo"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [income, setIncome] = useState<number | "">("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      setApiError(null);

      registerSchema.parse({
        name,
        secondName,
        email,
        password,
        confirmPassword,
        age: age === "" ? undefined : age,
        income: income === "" ? undefined : income,
      });

      const registerData: RegisterData = {
        name,
        secondName,
        email,
        password,
        age: age as number,
        income: income as number,
        profileType: "basic",
      };

      // registerUser já faz login automaticamente
      await registerUser(registerData);

      // Navegar para o chat após registro bem-sucedido
      navigate("/chat", { state: { showEvaluationModal: true } });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Erro ao registrar:", error);
        setApiError(
          error.message || "Erro ao registrar. Por favor, revise seus dados."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h2 className="text-center text-2xl font-bold mb-6">Registro</h2>
        <form className="space-y-4">
          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              className={`mt-1 block w-full p-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Sobrenome */}
          <div>
            <label
              htmlFor="secondName"
              className="block text-sm font-medium text-gray-700"
            >
              Sobrenome
            </label>
            <input
              id="secondName"
              className={`mt-1 block w-full p-2 border ${
                errors.secondName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              type="text"
              placeholder="Digite seu sobrenome"
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
              required
            />
            {errors.secondName && (
              <p className="text-red-500 text-sm mt-1">{errors.secondName}</p>
            )}
          </div>

          {/* E-mail */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              className={`mt-1 block w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              className={`mt-1 block w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirme sua Senha
            </label>
            <input
              id="confirmPassword"
              className={`mt-1 block w-full p-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Idade */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Idade
            </label>
            <input
              id="age"
              className={`mt-1 block w-full p-2 border ${
                errors.age ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              type="number"
              placeholder="Digite sua idade"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          {/* Renda */}
          <div>
            <label
              htmlFor="income"
              className="block text-sm font-medium text-gray-700"
            >
              Renda
            </label>
            <input
              id="income"
              className={`mt-1 block w-full p-2 border ${
                errors.income ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              type="number"
              placeholder="Digite sua renda"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              required
            />
            {errors.income && (
              <p className="text-red-500 text-sm mt-1">{errors.income}</p>
            )}
          </div>

          {/* Erro Geral de API */}
          {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}

          <div className="flex flex-col space-y-4 mt-4">
            <button
              className="w-full text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrar"}
            </button>
            <button
              className="w-full text-blue-600 font-semibold py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
              onClick={() => navigate("/login")}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
