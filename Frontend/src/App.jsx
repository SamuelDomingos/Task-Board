import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

// Componentes das páginas
import Home from "./pages/Home"; // Substitua com o caminho correto
import Register from "./pages/authentication/Register"; // Substitua com o caminho correto
import { useLoading } from "./context/LoadingContext";
import Loading from "./components/Loading";
import Login from "./pages/authentication/Login";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile";
import { useUserData } from "./hooks/useUserData";
import ProjectTasks from "./pages/ProjectTasks";

function App() {
  const { loading } = useLoading();
  const { user } = useContext(AuthContext); // Pega o usuário logado
  const { userData } = useUserData();
  const [formData, setFormData] = useState({});

  // Função auxiliar para gerar URL completa da imagem
  // No componente pai
  const getFullImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    // Se já for uma URL completa, retorna ela mesma
    if (profilePicture.startsWith("http")) return profilePicture;
    // Senão, combina com a URL base
    return `http://localhost:5000${profilePicture}`;
  };

  useEffect(() => {
    if (userData?.user) {
      setFormData(userData.user);
    }
  }, [userData]);

  return (
    <>
      {loading && <Loading />} {/* Exibe o Loading global */}
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <div className="app flex">
          <Routes>
            {/* Rota da Home - Apenas autenticados */}
            <Route
              path="/"
              element={
                user ? (
                  <Home
                    getFullImageUrl={getFullImageUrl(formData.profilePicture)}
                  />
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/user"
              element={
                user ? (
                  <UserProfile
                    getFullImageUrl={getFullImageUrl}
                    userData={formData}
                    setUser={(data) => setFormData(data)}
                  />
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            <Route
              path="/Project/:id"
              element={
                user ? (
                  <ProjectTasks
                  />
                ) : (
                  <Navigate to="/register" />
                )
              }
            />

            {/* Rota de Registro */}
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />
            {/* Rota de Login */}
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
