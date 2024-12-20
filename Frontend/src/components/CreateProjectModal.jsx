import { useState, useEffect } from "react";
import { useFriend } from "../hooks/useFriend";
import "./css/CreateProjectModal.css";
import ModalWrapper from "./ModalWrapper";
import { FaCheck, FaRegCalendarAlt, FaTimes, FaUserPlus } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const { fetchFriendsList } = useFriend();
  const [friendsList, setFriendsList] = useState([]);
  const [icon, setIcon] = useState("");
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    icon: null,
    hasDeadline: false,
    deadline: "",
    needsCollaboration: false,
    selectedCollaborators: [],
  });
  
  // Array de emojis para seleção
  const projectEmojis = [
    "📱",
    "💻",
    "🎨",
    "📝",
    "📚",
    "🎮",
    "🎯",
    "🚀",
    "⭐️",
    "💡",
    "🎸",
    "🎬",
    "📊",
    "🔧",
    "🏆",
  ];

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response = await fetchFriendsList();
        if (response?.friends) {
          setFriendsList(response.friends);
        }
      } catch (err) {
        console.error("Erro ao carregar amigos:", err);
      }
    };

    if (projectData.needsCollaboration) {
      loadFriends();
    }
  }, [projectData.needsCollaboration]);

  const toggleCollaborator = (friendId) => {
    setProjectData((prev) => {
      const isSelected = prev.selectedCollaborators.includes(friendId);
      return {
        ...prev,
        selectedCollaborators: isSelected
          ? prev.selectedCollaborators.filter((id) => id !== friendId)
          : [...prev.selectedCollaborators, friendId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        name: projectData.name,
        description: projectData.description,
        collaboratorAvatars: icon, // Certifique-se de usar o nome correto
        deadline: projectData.hasDeadline ? projectData.deadline : null,
        collaborators: projectData.needsCollaboration
          ? projectData.selectedCollaborators
          : [],
      };      

      await onSubmit(submitData);

      setProjectData({
        name: "",
        description: "",
        collaboratorAvatars: "",
        hasDeadline: false,
        deadline: "",
        needsCollaboration: false,
        selectedCollaborators: [],
      });

      onClose();
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    }
  };

  const handleClickIcon = (emoji) => {
    setIcon(emoji);
  };

  const toggleDeadline = () => {
    setProjectData({
      ...projectData,
      hasDeadline: !projectData.hasDeadline,
    });
  };

  const toggleCollaboration = () => {
    setProjectData({
      ...projectData,
      needsCollaboration: !projectData.needsCollaboration,
      selectedCollaborators: [],
    });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      {/* Estrutura correta do header igual ao AddFriend */}
      <div className="modal-header">
        <h2>Criar Novo Projeto</h2>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <form className="project-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome do Projeto*</label>
          <input
            type="text"
            id="name"
            required
            value={projectData.name}
            onChange={(e) =>
              setProjectData({ ...projectData, name: e.target.value })
            }
            placeholder="Digite o nome do projeto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={projectData.description}
            onChange={(e) =>
              setProjectData({ ...projectData, description: e.target.value })
            }
            placeholder="Descreva seu projeto"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Ícone do Projeto</label>
          <div className="emoji-grid">
            {projectEmojis.map((emoji, index) => (
              <div
                key={index}
                className={`emoji-item ${
                  icon === emoji ? "selected" : ""
                }`}
                onClick={() => handleClickIcon(emoji)}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        <div className="control-group" onClick={toggleDeadline}>
          <FaRegCalendarAlt className="control-icon" />
          <label className="checkbox-label">
            <input
              type="checkbox"
              className="hidden"
              checked={projectData.hasDeadline}
              readOnly
            />
            Definir meta de conclusão
          </label>
        </div>

        {projectData.hasDeadline && (
          <div className="form-group date-picker">
            <div className="date-input-container">
              <FaRegCalendarAlt />
              <input
                type="date"
                id="deadline"
                value={projectData.deadline}
                onChange={(e) =>
                  setProjectData({ ...projectData, deadline: e.target.value })
                }
              />
            </div>
          </div>
        )}

        <div className="control-group" onClick={toggleCollaboration}>
          <FaUserPlus className="control-icon" />
          <label className="checkbox-label">
            <input
              type="checkbox"
              className="hidden"
              checked={projectData.needsCollaboration}
              readOnly
            />
            Adicionar colaboradores
          </label>
        </div>

        {projectData.needsCollaboration && friendsList.length > 0 && (
          <div className="form-group collaborators-list">
            <label>Selecione os colaboradores:</label>
            <div className="friends-grid">
              {friendsList.map((friend) => (
                <div
                  key={friend._id}
                  className={`user-card ${
                    projectData.selectedCollaborators.includes(friend._id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => toggleCollaborator(friend._id)}
                >
                  <div className="user-info">
                    <div className="avatar">
                      <div className="avatar-fallback">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="user-details">
                      <span className="user-name">{friend.username}</span>
                      <span className="user-id">ID: {friend._id}</span>
                    </div>
                  </div>
                  {projectData.selectedCollaborators.includes(friend._id) && (
                    <FaCheck className="selected-indicator" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="action-button">
          Criar Projeto
        </button>
      </form>
    </ModalWrapper>
  );
};

export default CreateProjectModal;
