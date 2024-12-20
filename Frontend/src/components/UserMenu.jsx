
import { useState, useContext } from "react";
import "./css/UserMenu.css";
import { FiLogIn, FiLogOut, FiChevronRight } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserMenu = ({ photoPicture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="user-menu">
      {/* Profile Icon Button */}
      <button onClick={toggleMenu} className={`button ${isOpen ? "open" : ""}`}>
        {photoPicture ? (
          <img
            src={photoPicture}
            alt="Preview da foto de perfil"
            className="profile-image"
          />
        ) : (
          <FaUserCircle className={`icon ${isOpen ? "open" : ""}`} />
        )}
      </button>

      {/* Dropdown Menu */}
      <div className={`dropdown ${isOpen ? "open" : ""}`}>
        {/* Glass Effect Overlay */}
        <div className="backdrop" />

        {/* Content Container */}
        <div className="content">
          {/* Login Item */}
          <Link to="/user" className="menu-item">
            <div className="flex">
              <div className="icon-container flex">
                <FiLogIn className="LogIn" />
              </div>
              <span className="text">Acessar Conta</span>
            </div>
            <FiChevronRight className="chevron" />
          </Link>

          {/* Logout Item */}
          <div onClick={handleLogout} className="menu-item">
            <div className="flex">
              <div className="icon-container flex">
                <FiLogOut className="LogOut" />
              </div>
              <span className="text">Sair da Conta</span>
            </div>
            <FiChevronRight className="chevron" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
