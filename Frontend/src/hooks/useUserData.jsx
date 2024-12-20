import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserData, UpdateUser, UpdateUserProfilePicture } from "../service/api"; // Ajuste o caminho aqui
import { useLoading } from "../context/LoadingContext";

export const useUserData = () => {
  const { user } = useContext(AuthContext); // Pega o usuário logado
  const { setLoading } = useLoading(); // Controle de loading global

  const [userData, setUserData] = useState(null); // Armazena os dados do usuário
  const [error, setError] = useState(null); // Armazena erros, se ocorrerem

  // Função para buscar dados do usuário
  const fetchUserData = async () => {
    if (!user?.token) {
      setError("Usuário não autenticado.");
      return;
    }

    setLoading(true); // Ativa o loading
    try {
      const data = await getUserData(user.token); // Chama a API para buscar os dados
      setUserData(data); // Atualiza o estado local com os dados recebidos
    } catch (err) {
      setError(err.message || "Erro ao buscar dados do usuário.");
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  const updateUserData = async (formData) => {
    setLoading(true); // Ativa o loading
    try {
      // Envia a imagem se houver
      if (formData.has("profilePicture")) {
        const profilePicture = formData.get("profilePicture"); 
        console.log(profilePicture);
        
        await UpdateUserProfilePicture(profilePicture, user.token); // Envia a imagem
      }
  
      // Envia os outros dados do usuário
      const userDataWithoutImage = Object.fromEntries(formData); // Exclui a imagem do formData
      delete userDataWithoutImage.profilePicture; // Se necessário, exclui a chave da imagem
  
      const updatedUser = await UpdateUser(userDataWithoutImage, user.token); // Atualiza os dados do usuário sem a imagem
      setUserData(updatedUser); // Atualiza o estado com os novos dados
      return updatedUser;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      throw new Error(err.message || "Erro ao atualizar usuário.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };  
  

  // Busca os dados assim que o token estiver disponível
  useEffect(() => {
    if (user?.token) {
      fetchUserData();
    }
  }, [user?.token]);

  // Retorno do hook
  return {
    userData, // Dados do usuário
    error, // Erros encontrados
    fetchUserData, // Revalida os dados manualmente
    updateUserData, // Atualiza os dados
  };
};
