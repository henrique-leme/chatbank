import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      const isPublicRoute = ["/login", "/register"].includes(location.pathname);

      if (!firebaseUser && !isPublicRoute && !loading) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname, loading]);

  const signOut = () => {
    firebaseSignOut(auth).then(() => {
      setUser(null);
      navigate("/login");
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading && children}{" "}
      {/* Renderiza os filhos apenas quando o carregamento termina */}
    </AuthContext.Provider>
  );
};
