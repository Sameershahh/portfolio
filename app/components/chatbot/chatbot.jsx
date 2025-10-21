"use client";
import { useState } from "react";
import styles from "./chatbot.module.scss";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm Sameer's AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  //  Send message to your /api/chat route
  const handleSend = async () => {
  if (!input.trim()) return;
  const newMsg = { sender: "user", text: input };
  setMessages([...messages, newMsg]);
  setInput("");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    if (data.reply) {
      setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
    } else {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn’t get a response just now." },
      ]);
    }
  } catch (error) {
    console.error("Chat error:", error);
    setMessages(prev => [
      ...prev,
      { sender: "bot", text: "Sorry, something went wrong. Please try again." },
    ]);
  }
};

  //  Allow "Enter" key to send messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatbotWrapper}>
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Chat header */}
          <div className={styles.chatHeader}>💬 Chat with Sameer</div>

          {/* Chat messages */}
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${
                  msg.sender === "user" ? styles.userMsg : styles.botMsg
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing animation */}
            {isTyping && (
              <div className={`${styles.message} ${styles.botMsg}`}>
                <span className={styles.typingDots}>
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        className={`${styles.toggleBtn} ${isOpen ? styles.open : ""}`}
        onClick={toggleChat}
      >
        {isOpen ? "✖" : "💬"}
      </button>
    </div>
  );
}
