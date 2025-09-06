import { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes, FaSmile } from "react-icons/fa";
import Picker from "emoji-picker-react";
import { TbMessageChatbot } from "react-icons/tb";
import axios from "axios";

const formatTime = (date) => {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};
const formatDateLabel = (date) => {
  const today = new Date();
  const messageDate = new Date(date);
  const diffTime =
    today.setHours(0, 0, 0, 0) - messageDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return messageDate.toLocaleDateString();
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help?", time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const inactivityTimeoutRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (inactivityTimeoutRef.current)
        clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setShowEmojiPicker(false);
      }, 40000);
    }
    return () => {
      if (inactivityTimeoutRef.current)
        clearTimeout(inactivityTimeoutRef.current);
    };
  }, [isOpen, messages, input]);

  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current)
      clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setShowEmojiPicker(false);
    }, 40000);
  };

  const onEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    resetInactivityTimeout();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      from: "user",
      text: input.trim(),
      time: new Date(),
      isRead: false
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setShowEmojiPicker(false);
    resetInactivityTimeout();

    const formattedMessages = newMessages.map((msg) => ({
      role: msg.from === "user" ? "user" : "assistant",
      content: msg.text
    }));

    try {
      const response = await axios.post(
        "https://backend-makemytrip-px64.onrender.com/api/chatbots",
        {
          messages: formattedMessages
        }
      );
      const data = response.data;

      if (data.reply) {
        const updatedMessages = newMessages.map((msg, idx) =>
          idx === newMessages.length - 1 && msg.from === "user"
            ? { ...msg, isRead: true }
            : msg
        );

        setMessages([
          ...updatedMessages,
          { from: "bot", text: data.reply, time: new Date() }
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            from: "bot",
            text: "Sorry, I couldn't get a response.",
            time: new Date()
          }
        ]);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unknown error occurred.";

      setMessages([
        ...newMessages,
        {
          from: "bot",
          text: `Error: ${errorMessage}`,
          time: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      resetInactivityTimeout();
    }
  };

  return (
    <div>
      {!isOpen && (
  <button
  onClick={() => setIsOpen(true)}
  className="btn-chatbot-open position-fixed bottom-0 end-0 m-3 shadow animate-in"
  aria-label="Open Chatbot"
  title="Open Chatbot"
>
  <FaComments className="open-btn" />
</button>



      )}

      {isOpen && (
        <div
          ref={chatbotRef}
          className="position-fixed bottom-0 end-0 shadow chatbot-card border-0"
          style={{ zIndex: 1050 }}
        >
          <div className="text-white d-flex justify-content-between align-items-center p-2 chatbot-header">
            <div className="d-flex align-items-center">
              <TbMessageChatbot className="me-2" size={20} />
              ChatBot
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-link text-white p-0"
              aria-label="Close Chatbot"
              title="Close Chatbot"
            >
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-body d-flex flex-column flex-grow-1">
            {messages.map((msg, idx) => {
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const showDateLabel =
                !prevMsg ||
                new Date(msg.time).toDateString() !==
                  new Date(prevMsg.time).toDateString();

              return (
                <div key={idx}>
                  {showDateLabel && (
                    <div className="chatbot-date-separator text-center my-2 text-muted small">
                      {formatDateLabel(msg.time)}
                    </div>
                  )}
                  <div
                    className={`d-flex mb-2 ${
                      msg.from === "user"
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`chatbot-message ${
                        msg.from === "user" ? "chatbot-user" : "chatbot-bot"
                      }`}
                    >
                      <span className="chatbot-text">{msg.text}</span>
                      <span className="chatbot-time">
                        {formatTime(msg.time)}
                      </span>
                      {msg.from === "user" && (
                        <span
                          className={`chatbot-checkmarks ${
                            msg.isRead ? "read" : ""
                          }`}
                          aria-label={msg.isRead ? "Read" : "Sent"}
                          title={msg.isRead ? "Read" : "Sent"}
                        >
                          ✓✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && <div className="text-muted fst-italic">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-footer d-flex align-items-center gap-2">
            <button
              onClick={() => setShowEmojiPicker((val) => !val)}
              type="button"
              className="btn btn-light"
              aria-label="Toggle Emoji Picker"
              title="Toggle Emoji Picker"
              disabled={loading}
            >
              <FaSmile />
            </button>
            <textarea
              className="form-control flex-grow-1"
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resetInactivityTimeout();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={loading}
              style={{ resize: "none" }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={loading}
            >
              Send
            </button>
          </div>

          {showEmojiPicker && (
            <div
              className="position-absolute"
              style={{ bottom: "70px", right: "10px", zIndex: 9999 }}
            >
              <Picker onEmojiClick={onEmojiClick} theme="light" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
