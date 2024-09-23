import React, { useState } from "react";
import {
  FaUserCircle,
  FaCommentDots,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white p-4 h-auto sm:h-screen sm:w-64 flex flex-col">
      {/* Botão para abrir/fechar o menu em dispositivos móveis */}
      <div className="sm:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Menu</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          <FaUserCircle className="text-2xl" />
        </button>
      </div>

      {/* Menu */}
      <div
        className={`${isOpen ? "flex" : "hidden"} sm:flex flex-col flex-grow`}
      >
        <div className="flex flex-col flex-grow">
          <div
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle className="text-3xl mr-2" />
            <span>Perfil</span>
          </div>
          <div
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => navigate("/chat")}
          >
            <FaCommentDots className="text-2xl mr-2" />
            <span>Chat</span>
          </div>
          <div
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => navigate("/profile-evaluation")}
          >
            <FaChartBar className="text-2xl mr-2" />
            <span>Avaliação</span>
          </div>
        </div>
        <div
          className="flex items-center cursor-pointer mt-4 sm:mt-0"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-2xl mr-2" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
