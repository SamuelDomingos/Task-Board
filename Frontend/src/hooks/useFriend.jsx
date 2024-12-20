  import { useState, useContext, useEffect } from "react";
  import { AuthContext } from "../context/AuthContext";
  import { searchUsers, addFriend, getFriendsList, respondToFriendRequest} from "../service/api";
  import { useLoading } from "../context/LoadingContext";

  export const useFriend = () => {
    const { user } = useContext(AuthContext);
    const { setLoading } = useLoading();
    const [searchDataUsers, setSearchDataUsers] = useState(null);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Limpa os estados quando o componente é desmontado
    useEffect(() => {
      return () => {
        setLoading(false);
        setError(null);
        setSearchDataUsers(null);
        setNotifications([]);
      };
    }, [setLoading]);

    const fetchSearchUsers = async ({nameUser}) => {
      if (!user?.token) {
        setError("Usuário não autenticado.");
        return;
      }

      setLoading(true);
      try {
        const dataUsers = await searchUsers(nameUser, user.token);
        setSearchDataUsers(dataUsers.users);
      } catch (err) {
        setError(err.message || "Erro ao buscar dados do usuário.");
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRequestUsers = async ({idUser}) => {
      if (!user?.token) {
        setError("Usuário não autenticado.");
        return;
      }

      try {
        await addFriend(idUser, user.token);
        setSearchDataUsers(prev =>
          prev?.map(user =>
            user._id === idUser
              ? { ...user, status: 'request_sent' }
              : user
          )
        );
      } catch (err) {
        setError(err.message || "Erro ao enviar solicitação de amizade.");
        console.error("Erro ao enviar solicitação:", err);
      }
    };

    const fetchFriendsList = async () => {
      if (!user?.token) {
        setError("Usuário não autenticado.");
        return;
      }

      setLoading(true);
      try {
        const response = await getFriendsList(user.token);
        setNotifications(response.receivedRequests || []);
        return response;
      } catch (err) {
        setError(err.message || "Erro ao buscar lista de amigos.");
        console.error("Erro ao buscar lista:", err);
      } finally {
        setLoading(false);
      }
    };

    const handleFriendRequest = async ({ requestId, action }) => {
      if (!user?.token) {
        setError("Usuário não autenticado.");
        return;
      }

      try {
        const response = await respondToFriendRequest({ 
          requestId, 
          action 
        }, user.token);
        
        // Atualiza a lista de notificações após responder
        if (response.success) {
          setNotifications(prev => prev.filter(req => req._id !== requestId));
        }
      } catch (err) {
        setError(err.message || "Erro ao responder solicitação de amizade.");
        console.error("Erro ao responder solicitação:", err);
      }
    };

    const clearError = () => setError(null);

    return {
      fetchSearchUsers,
      fetchRequestUsers,
      fetchFriendsList,
      handleFriendRequest,
      searchDataUsers,
      notifications,
      error,
      clearError
    };
  };