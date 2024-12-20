import { useContext, useState } from "react";

import "./auth.css";
import { useLoading } from "../../context/LoadingContext";

import {
  Link,
  useNavigate
} from "react-router-dom";
import { useLoginUser } from "../../hooks/userLoginUser";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setLoading } = useLoading(); // Controle de loading global
  const { login, error } = useLoginUser(); // Hook de login
  const { login: contextLogin } = useContext(AuthContext); // Pega a função login do contexto
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
  
    setLoading(true); // Ativa o loading
  
    try {
      // Faz a requisição de login para a API
      const response = await login(formData);
  
      if (response) {
        const { token, user } = response; // Verifique se a API retorna um token e os dados do usuário.
        if (!token) throw new Error("Token não retornado pela API!");
  
        // Define a expiração do login
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
  
        const userData = {
          id: user._id,
          username: user.username,
          email: user.email,
          token: token,
          expiration: expirationDate.toISOString(),
        };
  
        // Chama o login do contexto
        contextLogin(userData);
  
        // Notifica o usuário e redireciona
        toast.success(`Seja bem-vindo, ${user.username}!`);
        navigate("/");
      }
    } catch (err) {
      // Exibe mensagem de erro
      toast.error(err.message || "Erro ao fazer login!");
    } finally {
      setLoading(false); // Finaliza o loading
    }
  };
  
  

  return (
    <form className="auth" onSubmit={handleSubmit}>
    <p>Entrar na conta
      <span>Acessar conta</span>
    </p>

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
    />

    <input
      type="password"
      name="password"
      placeholder="Senha"
      value={formData.password}
      onChange={handleChange}
      required
    />

    {error && <p className="error-message">{error}</p>}

    <div className="separator">
      <div></div>
    </div>

    <button type="submit" className="oauthButton">
      Entrar
    </button>

    <span>Ainda nao a conta? <Link to={"/register"}>Click Aqui</Link></span>
  </form>
  )
}

export default Login