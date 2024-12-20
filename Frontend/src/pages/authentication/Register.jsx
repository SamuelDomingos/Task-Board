import { useContext, useState } from "react";

import "./auth.css";
import { useRegisterUser } from "../../hooks/useRegisterUser";
import { useLoading } from "../../context/LoadingContext";

import {
  Link,
  useNavigate
} from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const { setLoading } = useLoading(); // Controle o estado global de loading
  const { login } = useContext(AuthContext); // Pega a função login do contexto
  const { register, error } = useRegisterUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.confirmPassword !== formData.password) {
      setErrors({ confirmPassword: "As senhas não são iguais!" });
      setTimeout(() => setErrors({}), 10000);
      return;
    }
  
    setLoading(true);
  
    try {
      // Faz o registro do usuário na API
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
  
      if (response) {
        // Garante que o token foi retornado
        const { token, user } = response; // Verifique a estrutura do retorno da API.
        if (!token) throw new Error("Token não retornado pela API!");
  
        // Define a expiração do token
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
  
        const userData = {
          username: user.username,
          email: user.email,
          token: token,
          expiration: expirationDate.toISOString(),
        };
  
        // Chama o login do contexto com os dados do usuário
        await login(userData); 
  
        // Notifica o sucesso e redireciona
        toast.success(`Seja bem-vindo, ${user.username}!`);
        navigate("/");
      }
    } catch (err) {
      // Notifica o erro
      toast.error(err.message || "Erro ao registrar o usuário!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <p>Criar Conta
        <span>Registre-se para acessar</span>
      </p>

      <input
        type="text"
        name="username"
        placeholder="Nome de Usuário"
        value={formData.username}
        onChange={handleChange}
        className={errors.username ? "input-error" : ""}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
          className={errors.email ? "input-error" : ""}
      />

      <input
        type="password"
        name="password"
        placeholder="Senha"
        value={formData.password}
        onChange={handleChange}
        className={errors.password ? "input-error" : ""}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar Senha"
        value={formData.confirmPassword}
        onChange={handleChange}
        className={errors.confirmPassword ? "input-error" : ""}
      />

      {error && <p className="error-message">{error}</p>}

      <div className="separator">
        <div></div>
      </div>

      <button type="submit" className="oauthButton">
        Cadastrar
      </button>

      <span>Ja tem cadastro? <Link to={"/login"}>Click Aqui</Link></span>
    </form>
  );
};

export default Register;
