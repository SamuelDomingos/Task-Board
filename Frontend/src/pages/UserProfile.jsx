import { useEffect, useState } from "react";
import { IoMdCamera } from "react-icons/io";
import { MdOutlineSaveAlt } from "react-icons/md";
import "./css/UserProfile.css";
import { useUserData } from "../hooks/useUserData"; // Certifique-se de ajustar o caminho
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const UserProfile = ({ userData, getFullImageUrl }) => {
  const { updateUserData } = useUserData();
  const [localData, setLocalData] = useState(userData || {});
  const [isEdited, setIsEdited] = useState(false);
  const [previewImageURL, setPreviewImageURL] = useState(null); // URL para preview da imagem
  const [newProfilePicture, setNewProfilePicture] = useState(null); // Novo arquivo de imagem

  const handleInputChange = (field, value) => {
    setLocalData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setIsEdited(true); // Marca que houve uma edição
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("username", localData.username);
      formData.append("description", localData.description);

      // Adiciona a nova imagem de perfil, se houver
      if (newProfilePicture) {
        formData.append("profilePicture", newProfilePicture);
      }

      if (isEdited) {
        // Só salva se houve edição
        await updateUserData(formData);

        toast.success("Dados atualizados com sucesso!");
        setIsEdited(false);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImageURL(URL.createObjectURL(file)); // Cria uma URL para preview
      setNewProfilePicture(file); // Armazena o arquivo selecionado
      setIsEdited(true); // Marca que houve uma edição
    }
  };

  useEffect(() => {
    setLocalData(userData || {});
  }, [userData]);

  return (
    <div className="profile-page flex-column">
      <div className="profile-container">
        <Link to={"/"} className="ButtonHome flex">
          <FaArrowLeft />
        </Link>

        <div className="profile-header">
          <h1>Perfil</h1>
          <span className="user-id">ID: {localData._id}</span>
        </div>

        <div className="profile-content">
          <div className="profile-image-section">
            <div className="profile-image-container flex">
              {previewImageURL ? (
                <img
                  src={previewImageURL}
                  alt="Preview da foto de perfil"
                  className="profile-image"
                />
              ) : localData.profilePicture ? (
                <img
                  src={getFullImageUrl(localData.profilePicture)}
                  alt="Foto de perfil"
                  className="profile-image"
                />
              ) : (
                <FaUserCircle size={100} className="default-icon" />
              )}

              <label className="image-upload-button">
                <IoMdCamera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden-input"
                  onChange={handleImageChange} // Mantém a mesma lógica do código principal
                />
              </label>
            </div>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={localData.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={localData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Fale um pouco sobre você"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={localData.email || ""}
                disabled
                className="disabled-input"
              />
            </div>

            <button
              onClick={handleSaveChanges}
              disabled={!isEdited}
              className={`save-button ${!isEdited ? "disabled" : ""}`}
            >
              <MdOutlineSaveAlt />
              <p>Salvar Alterações</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
