let currentUser = null;

// Login-Funktion
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/.netlify/functions/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });

  if (res.status === 200) {
    currentUser = await res.json();
    alert("Login erfolgreich!");

    // Login-Bereich ausblenden, Chat-Bereich einblenden
    document.getElementById("login").style.display = "none";
    document.getElementById("chat-container").style.display = "flex";

    loadMessages();
  } else {
    alert("Login fehlgeschlagen!");
  }
}

// Nachricht senden
async function send() {
  if (!currentUser) {
    alert("Bitte zuerst einloggen!");
    return;
  }

  const text = document.getElementById("message").value;
  if (!text.trim()) return;

  await fetch("/.netlify/functions/sendMessage", {
    method: "POST",
    body: JSON.stringify({ userId: currentUser.id, text })
  });

  document.getElementById("message").value = "";
  loadMessages();
}

// Nachrichten laden
async function loadMessages() {
  const res = await fetch("/.netlify/functions/getMessages");
  const messages = await res.json();

  const chat = document.getElementById("chat");
  chat.innerHTML = "";
  messages.forEach(msg => {
    const line = document.createElement("div");
    line.className = "msg";
    line.innerHTML = `<span class="user">${msg.username}</span>: ${msg.text} 
                      <span class="time">