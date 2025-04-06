let ws;
let currentChatId = "";
let currentUser = "";
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const sendBtn = document.getElementById("sendBtn");

const regUsernameInput = document.getElementById("regUsername");
const regPasswordInput = document.getElementById("regPassword");

const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");

const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");
const usersDiv = document.getElementById("users");
const chatsDiv = document.getElementById("chats");
const dashboard = document.getElementById("dashboard");
const currentChatSpan = document.getElementById("currentChat");

// Registro
registerBtn.addEventListener("click", () => {
  const username = regUsernameInput.value.trim();
  const password = regPasswordInput.value.trim();
  if (!username || !password) return alert("Completa ambos campos");
  fetch('http://localhost:8765/auth/signup', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("Usuario ya existe o error en registro");
      return res.json();
    })
    .then(data => {
      alert("Registrado correctamente. Ahora haz login.");
      regUsernameInput.value = "";
      regPasswordInput.value = "";
    })
    .catch(err => alert(err.message));
});

// Login
loginBtn.addEventListener("click", () => {
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value.trim();
  if (!username || !password) return alert("Completa ambos campos");
  fetch('http://localhost:8765/auth/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("Credenciales inválidas");
      return res.json();
    })
    .then(data => {
      currentUser = username;
      dashboard.style.display = "block";
      loadUsers();
      loadMyChats(currentUser);
      alert("Login exitoso");
    })
    .catch(err => alert(err.message));
});

// Cargar lista de usuarios
function loadUsers() {
  fetch('http://localhost:8765/auth/users')
    .then(res => res.json())
    .then(data => {
      usersDiv.innerHTML = "";
      data.users.forEach(u => {
        const div = document.createElement("div");
        div.textContent = u.username;
        div.className = "list-item";
        // Al hacer click se crea un chat entre el usuario actual y el usuario seleccionado
        div.addEventListener("click", () => {
          if (u.username === currentUser) return;
          createChat([currentUser, u.username]);
        });
        usersDiv.appendChild(div);
      });
    });
}

// Cargar chats del usuario
function loadMyChats(username) {
  fetch(`http://localhost:8765/chat/my_chats/${username}`)
    .then(res => res.json())
    .then(data => {
      chatsDiv.innerHTML = "";
      data.chats.forEach(chat => {
        const div = document.createElement("div");
        div.textContent = chat.members.join(", ");
        div.className = "list-item";
        div.addEventListener("click", () => {
          currentChatId = chat._id;
          currentChatSpan.textContent = chat.members.join(", ");
          loadChatHistory(currentChatId);
          connectWebSocket(currentChatId);
        });
        chatsDiv.appendChild(div);
      });
    });
}

// Crear chat
function createChat(members) {
  fetch('http://localhost:8765/chat/create', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ members })
  })
    .then(res => res.json())
    .then(data => {
      loadMyChats(currentUser);
      currentChatId = data.chat._id;
      currentChatSpan.textContent = members.join(", ");
      chatBox.innerHTML = "";
      connectWebSocket(currentChatId);
    });
}

// Cargar historial del chat
function loadChatHistory(chatId) {
  fetch(`http://localhost:8765/chat/history/${chatId}`)
    .then(res => res.json())
    .then(data => {
      chatBox.innerHTML = "";
      data.messages.forEach(m => {
        const msgDiv = document.createElement("div");
        msgDiv.textContent = `${m.sender_id}: ${m.content}`;
        chatBox.appendChild(msgDiv);
      });
    });
}

// Conectar WebSocket para el chat seleccionado
function connectWebSocket(chatId) {
  if (ws) ws.close();
  ws = new WebSocket(`ws://localhost:8765/ws/chat/${chatId}`);
  ws.onopen = () => {
    console.log("WebSocket connected");
  };
  ws.onmessage = (event) => {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = event.data;
    chatBox.appendChild(msgDiv);
  };
  ws.onclose = () => {
    console.log("WebSocket closed");
  };
}

// Enviar mensaje vía WebSocket
sendBtn.addEventListener("click", () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  const message = `${currentUser}: ${messageInput.value}`;
  ws.send(message);
  messageInput.value = "";
});
