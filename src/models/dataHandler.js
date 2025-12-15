const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// =======================
// FILE PATHS
// =======================
const usersFile = path.join(__dirname, "../../data/users.txt");
const messagesFile = path.join(__dirname, "../../data/messages.txt");

// =======================
// USERS HELPERS
// =======================
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, "utf8");
  if (!data.trim()) return [];
  return data.split("\n").map(line => JSON.parse(line));
}

function writeUsers(users) {
  const data = users.map(u => JSON.stringify(u)).join("\n");
  fs.writeFileSync(usersFile, data, "utf8");
}

// =======================
// REGISTER USER
// =======================
async function registerUser({ username, email, password }) {
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    email,
    password: hashedPassword,
    role: "user"
  };

  users.push(newUser);
  writeUsers(users);
  return newUser;
}

// =======================
// LOGIN USER
// =======================
async function loginUser({ email, password }) {
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) throw new Error("No user found with this email");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Incorrect password");

  return user;
}

// =======================
// AUTO CREATE ADMIN (IMPORTANT)
// =======================
async function ensureAdminExists() {
  const users = readUsers();

  const adminEmail = "admin@gmail.com";
  if (users.find(u => u.email === adminEmail)) return;

  const hashedPassword = await bcrypt.hash("admin123", 10);

  users.push({
    id: Date.now(),
    username: "Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin"
  });

  writeUsers(users);
  console.log("✅ Admin created: admin@gmail.com / admin123");
}

// =======================
// MESSAGES HELPERS
// =======================
function readMessages() {
  if (!fs.existsSync(messagesFile)) return [];
  const data = fs.readFileSync(messagesFile, "utf8");
  if (!data.trim()) return [];
  return data.split("\n").map(line => JSON.parse(line));
}

function writeMessages(messages) {
  const data = messages.map(m => JSON.stringify(m)).join("\n");
  fs.writeFileSync(messagesFile, data, "utf8");
}

function deleteMessage(id) {
  const messages = readMessages().filter(m => m.id !== Number(id));
  writeMessages(messages);
}

// =======================
// EXPORTS
// =======================
module.exports = {
  readUsers,
  writeUsers,
  registerUser,
  loginUser,
  ensureAdminExists,
  readMessages,
  writeMessages,
  deleteMessage
};
