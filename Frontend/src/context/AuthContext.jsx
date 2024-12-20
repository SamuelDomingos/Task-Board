import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado do usuário autenticado

  // Carregar usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const expiration = localStorage.getItem("authExpiration");

    if (storedUser && expiration) {
      const isExpired = new Date().getTime() > new Date(expiration || 0).getTime();

      if (!isExpired) {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("authUser");
        localStorage.removeItem("authExpiration");
      }
    }
  }, []);

  // Função para login ou registro
  const login = (userData) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Expiração de 1 dia

    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authExpiration", expirationDate.toISOString());

    setUser(userData);
  };

  // Função para logout
  const logout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authExpiration");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
