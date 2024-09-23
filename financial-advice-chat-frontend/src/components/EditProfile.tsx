import React, { useState } from "react";

interface User {
  name: string;
  secondName: string;
  email: string;
  password?: string;
  age: number;
  income: number;
  profileType: "basic" | "advanced";
}

interface EditProfileProps {
  user: User;
  updateUser: (updatedData: Partial<User>) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, updateUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    secondName: user?.secondName || "",
    email: user?.email || "",
    password: "",
    age: user?.age || "",
    income: user?.income || "",
    profileType: user?.profileType || "basic",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value.toString().trim() !== ""
      )
    );
    updateUser(filteredData as Partial<User>);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900">Editar Perfil</h3>

        {/* Nome e Sobrenome */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Nome
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="secondName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Sobrenome
            </label>
            <input
              type="text"
              name="secondName"
              id="secondName"
              value={formData.secondName}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            E-mail
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Senha */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Senha
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <p className="mt-1 text-xs text-gray-500">
            Deixe em branco se não quiser alterar.
          </p>
        </div>

        {/* Idade e Renda */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="age"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Idade
            </label>
            <input
              type="number"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="income"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Renda
            </label>
            <input
              type="number"
              name="income"
              id="income"
              value={formData.income}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </div>

        {/* Tipo de Perfil */}
        <div>
          <label
            htmlFor="profileType"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Tipo de Perfil
          </label>
          <select
            name="profileType"
            id="profileType"
            value={formData.profileType}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="basic">Básico</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>

        {/* Botão de Salvar */}
        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
