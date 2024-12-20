import { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaUsers } from 'react-icons/fa';
import { toast } from "react-hot-toast";
import './css/FriendRequests.css';
import ModalWrapper from './ModalWrapper';
import { useFriend } from '../hooks/useFriend';

const FriendRequests = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [friendsList, setFriendsList] = useState([]);

  const {
    fetchFriendsList,
    handleFriendRequest,
    notifications,
    error,
    clearError
  } = useFriend();

  const getFullImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    return `http://localhost:5000${profilePicture}`;
  };

  // Buscar solicitações e lista de amigos ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchFriendsList();
        if (response?.friends) {
          setFriendsList(response.friends);
        }
      } catch (err) {
        toast.error(err);
      }
    };
    
    loadData();
  }, []);

  // Handler para aceitar solicitação
  const handleAccept = async (request) => {
    setIsLoading(true);
    try {
      await handleFriendRequest({
        requestId: request.id,
        action: 'accepted'
      });
      toast.success(`Solicitação de ${request.sender?.username} aceita!`, {
        position: "top-right",
        autoClose: 3000
      });
      const response = await fetchFriendsList();
      if (response?.friends) {
        setFriendsList(response.friends);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para rejeitar solicitação
  const handleReject = async (request) => {
    setIsLoading(true);
    try {
      await handleFriendRequest({
        requestId: request.id,
        action: 'rejected'
      });
      toast.info(`Solicitação de ${request.sender?.username} recusada.`, {
        position: "top-right",
        autoClose: 3000
      });
      const response = await fetchFriendsList();
      if (response?.friends) {
        setFriendsList(response.friends);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para mostrar erros no toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        onClose: clearError
      });
    }
  }, [error]);

  return (
    <div className="friend-requests-container">
      <div className="notification-icon-wrapper">
        <FaUsers
          className="notification-icon"
          onClick={() => setIsOpen(true)}
          size={24}
        />
        {notifications.length > 0 && (
          <div className="notification-dot">{notifications.length}</div>
        )}
      </div>

      <ModalWrapper isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="requests-modal">
          <div className="modal-header">
            <h2>Gerenciar Amigos</h2>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                <FaBell className="tab-icon" />
                Solicitações
                {notifications.length > 0 && (
                  <span className="tab-badge requests">{notifications.length}</span>
                )}
              </button>
              <button 
                className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                <FaUsers className="tab-icon" />
                Amigos
                {friendsList.length > 0 && (
                  <span className="tab-badge friends">{friendsList.length}</span>
                )}
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === 'requests' && (
                <div className="requests-list">
                  {notifications && notifications.length > 0 ? (
                    notifications.map(request => (
                      <div key={request.id} className="request-item">
                        <div className="user-info">
                          <div className="avatar">
                            {request.sender?.profilePicture ? (
                              <img 
                                src={getFullImageUrl(request.sender.profilePicture)}
                                alt={request.sender.username}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-avatar.png";
                                }}
                              />
                            ) : (
                              <div className="avatar-fallback">
                                {request.sender?.username?.charAt(0).toUpperCase() || '?'}
                              </div>
                            )}
                          </div>
                          <div className="user-details">
                            <span className="username">{request.sender?.username}</span>
                            <span className="request-date">
                              {new Date(request.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="action-buttons">
                          <button 
                            className="accept-button"
                            onClick={() => handleAccept(request)}
                            disabled={isLoading}
                          >
                            <FaCheck />
                          </button>
                          <button 
                            className="reject-button"
                            onClick={() => handleReject(request)}
                            disabled={isLoading}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <FaBell size={48} />
                      <p>Nenhuma solicitação pendente</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'friends' && (
                <div className="friends-list">
                  {friendsList && friendsList.length > 0 ? (
                    friendsList.map(friend => (
                      <div key={friend.id} className="friend-item">
                        <div className="user-info">
                          <div className="avatar">
                            {friend.profilePicture ? (
                              <img 
                                src={getFullImageUrl(friend.profilePicture)}
                                alt={friend.username}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-avatar.png";
                                }}
                              />
                            ) : (
                              <div className="avatar-fallback">
                                {friend.username?.charAt(0).toUpperCase() || '?'}
                              </div>
                            )}
                          </div>
                          <div className="user-details">
                            <span className="username">{friend.username}</span>
                            {friend.status && (
                              <span className={`status ${friend.status}`}>
                                {friend.status === 'online' ? 'Online' : 'Offline'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <FaUsers size={48} />
                      <p>Você ainda não tem amigos adicionados</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default FriendRequests;