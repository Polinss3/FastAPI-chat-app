let ws;
let currentChatId = "";
let currentUser = "";

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

const regUsernameInput = document.getElementById("regUsername");
const regPasswordInput = document.getElementById("regPassword");

const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");

const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");
const chatsDiv = document.getElementById("chats");
const currentChatSpan = document.getElementById("currentChat");
const currentUserName = document.getElementById("currentUserName");

const authSection = document.getElementById("authSection");
const dashboard = document.getElementById("dashboard");

// Modal elements
const newChatModal = document.getElementById("newChatModal");
const userSelect = document.getElementById("userSelect");
const modalClose = document.querySelector(".modal-content .close");
const createChatBtn = document.getElementById("createChatBtn");

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
      authSection.style.display = "none";
      dashboard.style.display = "flex";
      currentUserName.textContent = currentUser;
      loadChats();
    })
    .catch(err => alert(err.message));
});

// Cargar chats del usuario
function loadChats() {
  fetch(`http://localhost:8765/chat/my_chats/${currentUser}`)
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
    try {
      const msg = JSON.parse(event.data);
      const msgDiv = document.createElement("div");
      // Asigna estilos según si el mensaje es del usuario actual o no
      if (msg.sender_id === currentUser) {
        msgDiv.className = "my-message";
      } else {
        msgDiv.className = "other-message";
      }
      msgDiv.textContent = `${msg.sender_id}: ${msg.content}`;
      chatBox.appendChild(msgDiv);
      // Desplaza el scroll al final
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (e) {
      console.error("Error parsing WebSocket message", e);
    }
  };
  ws.onclose = () => {
    console.log("WebSocket closed");
  };
}

// Enviar mensaje vía WebSocket y guardar en DB
// Enviar mensaje vía REST y WebSocket (se mostrará solo al recibirlo por WebSocket)
sendBtn.addEventListener("click", () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  if (!currentChatId) {
    alert("No se ha seleccionado un chat");
    return;
  }
  
  const content = messageInput.value.trim();
  if (!content) return;
  
  // Construimos el objeto que cumple con el esquema: chat_id, sender_id y content
  const messageObj = {
    chat_id: currentChatId,
    sender_id: currentUser,
    content: content
  };
  
  // Llamada REST para guardar el mensaje (siempre se guarda, independientemente de la conexión del receptor)
  fetch('http://localhost:8765/chat/send', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageObj)
  })
    .then(res => {
      if (!res.ok) {
        console.error("Error al guardar el mensaje:", res.statusText);
      }
      return res.json();
    })
    .catch(err => console.error(err));
  
  // Enviar el mensaje por WebSocket (como JSON)
  ws.send(JSON.stringify(messageObj));
  
  // Borramos el input (no agregamos el mensaje localmente, se mostrará al recibirlo vía WebSocket)
  messageInput.value = "";
});


// Abrir modal para nuevo chat
newChatBtn.addEventListener("click", () => {
  newChatModal.style.display = "block";
  loadUserSelect();
});

// Cerrar modal
modalClose.addEventListener("click", () => {
  newChatModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target == newChatModal) {
    newChatModal.style.display = "none";
  }
});

// Cargar select de usuarios para el modal
function loadUserSelect() {
  fetch('http://localhost:8765/auth/users')
    .then(res => res.json())
    .then(data => {
      userSelect.innerHTML = `<option value="">Selecciona un usuario</option>`;
      data.users.forEach(u => {
        if(u.username !== currentUser) {
          const option = document.createElement("option");
          option.value = u.username;
          option.textContent = u.username;
          userSelect.appendChild(option);
        }
      });
    });
}

// Crear nuevo chat desde el modal
createChatBtn.addEventListener("click", () => {
  const selectedUser = userSelect.value;
  if (!selectedUser) return alert("Selecciona un usuario");
  fetch('http://localhost:8765/chat/create', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ members: [currentUser, selectedUser] })
  })
    .then(res => res.json())
    .then(data => {
      newChatModal.style.display = "none";
      loadChats();
      currentChatId = data.chat._id;
      currentChatSpan.textContent = data.chat.members.join(", ");
      chatBox.innerHTML = "";
      connectWebSocket(currentChatId);
    })
    .catch(err => console.error(err));
});
