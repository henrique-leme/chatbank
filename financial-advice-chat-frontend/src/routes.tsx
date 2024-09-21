import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { AuthProvider } from "./context/AuthContext";
import EvaluateProfile from "./pages/EvaluateProfile";
import EditProfilePage from "./pages/EditProfilePage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<EditProfilePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-evaluation" element={<EvaluateProfile />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
