import { useState, useEffect } from "react";
import { FaSearch, FaUserClock, FaUserFriends, FaTimes } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import "./css/AddFriend.css";
import { useFriend } from "../hooks/useFriend";
import ModalWrapper from "./ModalWrapper";

const AddFriend = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { fetchSearchUsers, fetchRequestUsers, searchDataUsers } = useFriend();

  useEffect(() => {
    // Limpa o estado de busca se o termo estiver vazio
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);
        await fetchSearchUsers({ nameUser: searchTerm });
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false); // Garante que o loading é desativado quando o componente é desmontado
    };
  }, [searchTerm, fetchSearchUsers]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setIsSearching(false); // Desativa o loading se o campo estiver vazio
    }
  };

  // Corrige o handleSendRequest
  const handleSendRequest = (userId) => {
    if (!searchDataUsers || !userId) return;
    
    // Chama a função passando corretamente o objeto com idUser
    fetchRequestUsers({ idUser: userId });
  };

  return (
    <div className="friend-request-container">
      <button className="add-friend-button" onClick={() => setIsOpen(true)}>
        <svg
          className="plus-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 4v16m-8-8h16" />
        </svg>
        <span>Adicionar Amigo</span>
      </button>

      <ModalWrapper isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="modal-header">
          <h2>Procurar Usuários</h2>
          <button className="close-button" onClick={() => setIsOpen(false)}>
          <FaTimes />
          </button>
        </div>

        <div className="search-container">
          <FaSearch
            className={`search-icon ${isSearching ? "searching" : ""}`}
          />
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="results-container">
          {searchDataUsers &&
            searchDataUsers.map((user, index) => (
              <div
                key={user._id}
                className="user-card"
                style={{ "--delay": `${index * 0.1}s` }}
              >
                <div className="user-info">
                  <div className="avatar">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.username} />
                    ) : (
                      <div className="avatar-fallback">
                        {user.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user.username}</span>
                    <span className="user-id">ID: {user._id}</span>
                  </div>
                </div>

                <button
                  className={`action-button ${
                    user.status === "friend"
                      ? "friend"
                      : user.status === "request_sent"
                      ? "sent"
                      : ""
                  }`}
                  // Corrige a chamada do onClick
                  onClick={() => handleSendRequest(user._id)}
                  disabled={
                    user.status === "friend" || user.status === "request_sent"
                  }
                >
                  {user.status === "friend" ? (
                    <FaUserFriends />
                  ) : user.status === "request_sent" ? (
                    <FaUserClock />
                  ) : (
                    <FaUserPlus />
                  )}
                </button>
              </div>
            ))}

          {searchDataUsers && searchDataUsers.length === 0 && (
            <div className="no-results">
              <svg
                className="user-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 10-16 0" />
              </svg>
              <p>Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </ModalWrapper>
    </div>
  );
};

export default AddFriend;