// src/lib/api.js
import axios from "axios";

// Reads VITE_API_BASE=https://api.qpfai.io from .env or falls back to empty
const API_BASE = import.meta.env.VITE_API_BASE || "";

// Send a chat message to the backend
export function sendChat(text, userId) {
  return axios
    .post(
      `${API_BASE}/chat`,
      { text },
      {
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
      }
    )
    .then((res) => res.data)        // { response: "…" }
    .catch((err) => {
      console.error("Chat error:", err);
      throw err;
    });
}
