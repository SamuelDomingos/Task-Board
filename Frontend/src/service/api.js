const BASE_URL = "http://localhost:5000/api"; // Substitua pela URL do backend

async function request(endpoint, { token, isFile = false, ...options } = {}) {
  try {
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFile && { "Content-Type": "application/json" }),
    };

    if (isFile && options.body && !(options.body instanceof FormData)) {
      const formData = new FormData();
      formData.append("profilePicture", options.body);
      options.body = formData;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Verifica se a resposta é JSON antes de fazer o parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro na requisição.");
      } else {
        throw new Error(`Erro ${response.status} na requisição.`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error.message);
    throw error;
  }
}

// ---------- Auth ----------
export const registerUser = async (userData) =>
  request("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const loginUser = async (credentials) =>
  request("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const UpdateUser = async (credentials, token) =>
  request("/update", {
    method: "PUT",
    body: JSON.stringify(credentials),
    token,
  });

export const UpdateUserProfilePicture = async (profilePicture, token) => {
  if (!profilePicture) {
    throw new Error("Nenhuma imagem foi selecionada.");
  }

  return await request("/profile-picture", {
    method: "POST",
    body: profilePicture,
    token,
    isFile: true, // Indica que é um upload de arquivo
  });
};

export const getUserData = async (token) =>
  request("/user", { method: "GET", token });

// ---------- Containers de Projetos (Blocks) ----------
export const createProjectContainer = async (data, token) =>
  request("/blocks", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });

export const getAllProjectContainers = async (token) =>
  request("/blocks", { method: "GET", token });

export const updateProjectContainer = async (id, data, token) =>
  request(`/blocks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });

export const deleteProjectContainer = async (id, token) =>
  request(`/blocks/${id}`, { method: "DELETE", token });

// ---------- Tasks ----------
export const createTask = async (idBlock, data, token) =>
  request(`/blocks/${idBlock}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });

export const getTasksByProject = async (idBlock, token) =>
  request(`/blocks/${idBlock}/tasks`, { method: "GET", token });

export const updateTask = async (idBlock, idTask, data, token) =>
  request(`/blocks/${idBlock}/tasks/${idTask}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });

export const deleteTask = async (idBlock, idTask, token) =>
  request(`/blocks/${idBlock}/tasks/${idTask}`, {
    method: "DELETE",
    token,
  });

// ---------- Amizades ----------
export const addFriend = async (friendId, token) =>
  request("/friends/request", {
    method: "POST",
    body: JSON.stringify({ friendId }),
    token,
  });

export const getFriendsList = async (token) =>
  request("/friends", { method: "GET", token });

export const respondToFriendRequest = async ({ requestId, action }, token) => {
  return request("/friends/respond", {
    method: "POST",
    body: JSON.stringify({
      requestId,
      action, // agora usando 'accepted' ou 'rejected'
    }),
    token,
  });
};

export const removeFriend = async (friendId, token) =>
  request(`/friends/${friendId}`, { method: "DELETE", token });

export const searchUsers = async (searchTerm, token) =>
  request(`/friends/search?term=${searchTerm}`, {
    method: "GET",
    token,
  });
