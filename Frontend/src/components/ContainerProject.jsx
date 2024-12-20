import { useState } from "react";
import ProjectCard from "./ProjectCard";
import { FaPlusCircle } from "react-icons/fa";
import "./css/ContainerProject.css";
import CreateProjectModal from "./CreateProjectModal";
import { useBlocksManagement } from "../hooks/useBlocks";

const ContainerProject = () => {
  const { blocks = [], loading, error, createBlock, updateBlock, deleteBlock } = useBlocksManagement();
  const [isOpen, setIsOpen] = useState(false);

  console.log(blocks);
  

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleCreateProject = async (projectData) => {
    try {
      await createBlock(projectData);
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao criar projeto:", err);
    }
  };

  const handleEditProject = async (blockId, updateData) => {
    try {
      await updateBlock(blockId, updateData);
    } catch (err) {
      console.error("Erro ao editar projeto:", err);
    }
  };

  const handleDeleteProject = async (blockId) => {
    try {
      await deleteBlock(blockId);
    } catch (err) {
      console.error("Erro ao deletar projeto:", err);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="projects-container flex-column">
      <div className="projects-grid">
        {blocks && blocks.map((block) => block && (
          <ProjectCard
            key={block._id}
            project={block}
            onEdit={(project) => handleEditProject(block._id, project)}
            onDelete={() => handleDeleteProject(block._id)}
          />
        ))}
      </div>

      <button className="add-project-button flex" onClick={handleOpenModal}>
        <FaPlusCircle className="plus-icon" />
        <span>Adicionar Projeto</span>
      </button>

      <CreateProjectModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default ContainerProject;