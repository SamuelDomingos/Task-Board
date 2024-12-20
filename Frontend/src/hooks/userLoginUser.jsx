import { useState } from "react";
import { loginUser } from "../service/api"; // Função para chamar o backend

export const useLoginUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const login = async (credentials) => {
    setLoading(true);
    setError(null);


    try {
      const data = await loginUser(credentials); // Chamada à API de login

      return data; // Retorna os dados do usuário
    } catch (err) {
      setError(err.message || "Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error};
};
