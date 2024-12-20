import "./css/ProjectTasks.css";
import { Link, useLocation} from "react-router-dom";
import { HiPencilSquare } from "react-icons/hi2";
import { FaCheckCircle, FaPlus, FaArrowLeft  } from "react-icons/fa";
import { LiaCheckSquareSolid } from "react-icons/lia";
import { FiBarChart2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useTasks } from "../hooks/useTasks";
import { useState } from "react";
import ModalWrapper from "../components/ModalWrapper";
const ProjectTasks = () => {
  const location = useLocation();
  const { projectData } = location.state || {};
  const { tasks, loading, createTask, updateTask, deleteTask } =
    useTasks(projectData?._id);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState("");

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

  const getTaskIcon = (status) => {
    switch (status) {
      case "em-processo":
        return <HiPencilSquare />;
      case "completo":
        return <FaCheckCircle />;
      case "incompleto":
        return <IoMdClose />;
      default:
        return <HiPencilSquare />;
    }
  };

  const handleAddTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setIcon(task.icon);
    setStatus(task.status);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTask(null);
    setTitle("");
    setDescription("");
    setIcon("");
    setStatus("");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask({
        title,
        description,
        icon,
        status,
      }); // Usa o createTask do hook
      handleCloseModals();
    } catch (error) {
      console.error("Erro ao criar a tarefa:", error);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await updateTask(selectedTask._id, {
        title,
        description,
        icon,
        status,
      }); // Usa o updateTask do hook
      handleCloseModals();
    } catch (error) {
      console.error("Erro ao atualizar a tarefa:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId); // Usa o deleteTask do hook
    } catch (error) {
      console.error("Erro ao excluir a tarefa:", error);
    }
  };

  const handleStatusClick = (status) => {
    setStatus(status);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="task-board">
      <div className="container">

        <Link to={"/"} className="ButtonHome flex">
          <FaArrowLeft />
        </Link>

        <div className="task-board-header">
          <h1 className="task-board-title">
            {projectData?.collaboratorAvatars || "Meu Quadro de Tarefas"}{" "}
            {projectData?.name || "Meu Quadro de Tarefas"}
          </h1>
          <p className="task-board-description">
            {projectData?.description || "Tarefas para manter organizado"}
          </p>
        </div>

        <div className="task-list">
          {Array.isArray(tasks) &&
            tasks.map((task) => (
              <div
                onClick={() => handleOpenEditModal(task)}
                key={task._id}
                className={`task-card flex ${task.status}`}
              >
                <div className="task-icon flex">{task.icon}</div>
                <div className="task-details">
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                </div>
                <div className="task-status flex">
                  {getTaskIcon(task.status)}
                </div>
              </div>
            ))}

          {/* Botão adicionar tarefa */}
          <button className="add-task-button flex" onClick={handleAddTask}>
            <div className="flex">
              <FaPlus />
            </div>
            <span className="add-task-text">Adicionar nova tarefa</span>
          </button>
        </div>

        <ModalWrapper isOpen={isCreateModalOpen} onClose={handleCloseModals}>
          <form onSubmit={handleCreateTask} className="project-form">
            <h2>Criar Nova Tarefa</h2>
            <div className="form-group">
              <label htmlFor="titulo">Nome da Tarefa*</label>
              <input
                type="text"
                id="titulo"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                placeholder="Descrição"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Ícone da tarefa</label>
              <div className="emoji-grid">
                {projectEmojis.map((emoji, index) => (
                  <div
                    key={index}
                    className={`emoji-item ${icon === emoji ? "selected" : ""}`}
                    onClick={() => setIcon(emoji)}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <div
                className={`flex status-option not ${
                  status === "incompleto" ? "selected" : ""
                }`}
                onClick={() => handleStatusClick("incompleto")}
              >
                <div className="flex">
                  <IoMdClose />
                </div>
                <span>Incompleto</span>
                {status === "incompleto" ? (
                  <FaCheckCircle className="check" />
                ) : null}
              </div>
              <div
                className={`flex status-option process ${
                  status === "em-processo" ? "selected" : ""
                }`}
                onClick={() => handleStatusClick("em-processo")}
              >
                <div className="flex">
                  <FiBarChart2 />
                </div>
                <span>Em processo</span>
                {status === "em-processo" ? (
                  <FaCheckCircle className="check" />
                ) : null}
              </div>
              <div
                className={`flex status-option completed ${
                  status === "completo" ? "selected" : ""
                }`}
                onClick={() => handleStatusClick("completo")}
              >
                <div className="flex">
                  <LiaCheckSquareSolid />
                </div>
                <span>Completo</span>
                {status === "completo" ? (
                  <FaCheckCircle className="check" />
                ) : null}
              </div>
            </div>

            <input
              type="submit"
              className="action-button flex"
              value="Criar Tarefa"
            />
          </form>
        </ModalWrapper>

        <ModalWrapper isOpen={isEditModalOpen} onClose={handleCloseModals}>
          <form onSubmit={handleUpdateTask} className="project-form">
            <h2>Editar Tarefa</h2>

            <div className="form-group">
              <label htmlFor="titulo">Nome da Tarefa*</label>
              <input
                type="text"
                id="titulo"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                placeholder="Descrição"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Ícone da tarefa</label>
              <div className="emoji-grid">
                {projectEmojis.map((emoji, index) => (
                  <div
                    key={index}
                    className={`emoji-item ${icon === emoji ? "selected" : ""}`}
                    onClick={() => setIcon(emoji)}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <div
                className={`flex status-option not ${
                  status === "incompleto" ? "selected" : ""
                }`}
                onClick={() => setStatus("incompleto")}
              >
                <div className="flex">
                  <IoMdClose />
                </div>
                <span>Incompleto</span>
                {status === "incompleto" ? (
                  <FaCheckCircle className="check" />
                ) : null}
              </div>
              <div
                className={`flex status-option process ${
                  status === "em-processo" ? "selected" : ""
                }`}
                onClick={() => setStatus("em-processo")}
              >
                <div className="flex">
                  <FiBarChart2 />
                </div>
                <span>Em processo</span>
                {status === "em-processo" ? (
                  <FaCheckCircle className="check" />
                ) : null}
              </div>
              <div
                className={`flex status-option completed ${
                  status === "completo" ? "selected" : ""
                }`}
                onClick={() => setStatus("completo")}
              >
                <div className="flex">
                  <LiaCheckSquareSolid />
                </div>
                <span>Completo</span>
                {status === "completo" ? (
                  <FaCheckCircle className="check" />
                ) : null}
              </div>
            </div>

            <input
              type="submit"
              className="action-button flex"
              value="Editar Tarefa"
            />
            <button
              type="button"
              className="delete-button"
              onClick={() => handleDeleteTask(selectedTask?._id)}
            >
              Excluir Tarefa
            </button>
          </form>
        </ModalWrapper>
      </div>
    </div>
  );
};

export default ProjectTasks;
