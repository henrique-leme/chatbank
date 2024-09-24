import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import EditProfile from "../components/EditProfile";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../api/apiRoutes";

const EditProfilePage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Erro ao carregar perfil do usuário:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const handleUpdateUser = async (updatedData: Partial<any>) => {
    if (user && userProfile) {
      try {
        await updateUserProfile(user.uid, updatedData);
        setUserProfile({ ...userProfile, ...updatedData });
        alert("Perfil atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar perfil do usuário:", error);
        alert("Erro ao atualizar o perfil.");
      }
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!userProfile) {
    return <p>Erro ao carregar perfil.</p>;
  }

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <Sidebar />

      <div className="flex-grow bg-gray-200 p-4 sm:p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg border shadow-md p-6">
          <EditProfile user={userProfile} updateUser={handleUpdateUser} />
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
