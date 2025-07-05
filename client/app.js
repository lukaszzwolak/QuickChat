const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName = "";

const socket = io();

// nasłuchiwacz
socket.on("message", ({ author, content }) => {
  addMessage(author, content);
});

socket.on("newUser", (name) => {
  addMessage("Chat Bot", `${name} has joined the conversation!`);
});

socket.on("removeUser", (name) => {
  addMessage("Chat Bot", `${name} has left the conversation... :(`);
});

// login form handler
const login = (event) => {
  event.preventDefault();

  const enteredName = userNameInput.value.trim();

  if (!enteredName) {
    alert("Please enter your name");
    return;
  }

  userName = enteredName;

  socket.emit("join", userName);

  loginForm.classList.remove("show");
  messagesSection.classList.add("show");
};

loginForm.addEventListener("submit", login);

// send message handler
const sendMessage = (event) => {
  event.preventDefault();

  const messageContent = messageContentInput.value.trim();

  if (!messageContent) {
    alert("Please enter a message");
    return;
  }

  addMessage(userName, messageContent);
  socket.emit("message", { author: userName, content: messageContent });
  messageContentInput.value = "";
};

addMessageForm.addEventListener("submit", sendMessage);

// function addMessage
function addMessage(author, content) {
  const message = document.createElement("li");
  message.classList.add("message");
  message.classList.add("message--received");
  if (author === userName) message.classList.add("message--self");

  message.innerHTML = `
    <h3 class="message__author">${userName === author ? "You" : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;

  messagesList.appendChild(message);
}
