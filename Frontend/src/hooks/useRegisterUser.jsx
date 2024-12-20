import { useState } from "react";
import { registerUser } from "../service/api"; // Importe a função que você criou para o backend

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await registerUser(userData);
      setSuccess(data); // Marca como sucesso caso tudo dê certo
      return data;
    } catch (err) {
      setError(err.message || "Erro no registro.");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};
