// ProjectCard.js
import { useContext, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import "./css/ProjectCard.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// eslint-disable-next-line react/prop-types
const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const handleEdit = () => {
    onEdit(project);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja deletar este projeto?")) {
      onDelete();
      setIsMenuOpen(false);
    }
  };

  const getFullImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith("http")) return profilePicture;
    return `http://localhost:5000${profilePicture}`;
  };

  return (
    <div className="project-card">
      {/* Envolvemos o conteúdo clicável com o Link */}
      <Link
        to={`/Project/${project._id}`}
        state={{ projectData: project }}
        className="project-link"
      >

        <div className="project-name">
          <h3>{project.name}</h3>
          <span className="project-icon">{project.collaboratorAvatars}</span>
        </div>
      </Link>

      {/* Parte que não redireciona */}
      <div className="collaborators">
        {[project.owner, ...project.collaborators]
          .filter((person) => person._id !== user.id) // Remove o usuário logado da lista
          .map((person, index) => (
            <div
              key={index}
              className="collaborator-avatar"
              title={person.username}
              onClick={(e) => e.stopPropagation()} // Impede o clique de redirecionar
            >
              {person.profilePicture ? (
                <img
                  src={getFullImageUrl(person.profilePicture)}
                  alt={person.username}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
              ) : (
                <div className="avatar-fallback">
                  {person.username?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="menu-container">
        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation(); // Impede o clique de redirecionar
            setIsMenuOpen(!isMenuOpen);
          }}
          onBlur={() => setTimeout(() => setIsMenuOpen(false), 200)}
          aria-label="Menu do projeto"
        >
          <FiMoreVertical className="menu-icon" />
        </button>
        {isMenuOpen && (
          <div className="dropdown-menu">
            <button
              className="menu-item"
              onClick={(e) => {
                e.stopPropagation(); // Impede o clique de redirecionar
                handleEdit();
              }}
              aria-label="Editar projeto"
            >
              <LiaEdit className="item-icon" />
              Editar
            </button>
            <button
              className="menu-item delete"
              onClick={(e) => {
                e.stopPropagation(); // Impede o clique de redirecionar
                handleDelete();
              }}
              aria-label="Deletar projeto"
            >
              <MdDelete className="item-icon" />
              Deletar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
