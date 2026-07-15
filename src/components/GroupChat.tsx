import { API_BASE_URL } from "../config/api";
import { useEffect, useRef, useState } from "react";

type GroupChatProps = {
  selectedBranch: string;
  memberName: string;
  senderType: string;
  department: string;
  setPage: (page: string) => void;
  backPage: string;
};

type ChatMessage = {
  id: number;
  sender_name: string;
  sender_type: string;
  department: string;
  message: string;
  branch: string;
  created_at: string;
};

const API_URL = API_BASE_URL;

export default function GroupChat({
  selectedBranch,
  memberName,
  senderType,
  department,
  setPage,
  backPage,
}: GroupChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState<ChatMessage | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const senderDepartment = department || "Member";
  const roomName = `${selectedBranch} Church Group`;
  const displayName = memberName || senderType || "Guest";

  const loadMessages = async () => {
    const response = await fetch(
      `${API_URL}/chat-messages/${encodeURIComponent(selectedBranch)}`
    );
    const data = await response.json();
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedBranch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender_name", displayName);
    formData.append("sender_type", senderType);
  formData.append("department", senderDepartment);
    formData.append("branch", selectedBranch);

    await fetch(`${API_URL}/upload-chat-file`, {
      method: "POST",
      body: formData,
    });

    event.target.value = "";
    loadMessages();
  };

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;

    await fetch(`${API_URL}/chat-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_name: displayName,
        sender_type: senderType,
  department: senderDepartment,
        message: replyMessage
          ? `Reply to ${replyMessage.sender_name}: "${replyMessage.message}"\n\n${text}`
          : text,
        branch: selectedBranch,
      }),
    });

    setNewMessage("");
    setReplyMessage(null);
    loadMessages();
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;

    await fetch(`${API_URL}/chat-messages/${id}`, {
      method: "DELETE",
    });

    setShowMenu(false);
    loadMessages();
  };

  const updateMessage = async () => {
    if (!editingMessage || !newMessage.trim()) return;

    await fetch(`${API_URL}/chat-messages/${editingMessage.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage.trim() }),
    });

    setEditingMessage(null);
    setNewMessage("");
    setShowMenu(false);
    loadMessages();
  };

  const renderMessageBody = (message: string) => {
    if (message.startsWith("[IMAGE]")) {
      return (
        <img
          src={`${API_URL}/uploads/${message.replace("[IMAGE]", "")}`}
          style={{
            maxWidth: "280px",
            width: "100%",
            borderRadius: "8px",
            display: "block",
          }}
        />
      );
    }

    if (message.startsWith("[VIDEO]")) {
      return (
        <video controls style={{ maxWidth: "320px", width: "100%", borderRadius: "8px" }}>
          <source src={`${API_URL}/uploads/${message.replace("[VIDEO]", "")}`} />
        </video>
      );
    }

    if (message.startsWith("[FILE]")) {
      const [filename, original] = message.replace("[FILE]", "").split("|");
      return (
        <a
          href={`${API_URL}/uploads/${filename}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#0b57d0", fontWeight: 700, textDecoration: "none" }}
        >
          File: {original || filename}
        </a>
      );
    }

    return message;
  };

  return (
    <div
      className="group-chat"
      style={{
        height: "100vh",
        display: "flex",
        background: "#e7e5df",
        color: "#1f2933",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            background: "#075e54",
            color: "white",
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.18)",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "22px" }}>{roomName}</h2>
            <div style={{ fontSize: "13px", opacity: 0.88, marginTop: "3px" }}>
              All departments | Signed in as {displayName}
            </div>
          </div>

          <button
            onClick={() => setPage(backPage)}
            style={{
              background: "#ffffff",
              color: "#075e54",
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Back
          </button>
        </header>

        <section
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "22px",
            background: "#efe7dd",
          }}
        >
          {messages.map((message) => {
            const mine = message.sender_name === displayName;

            return (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: mine ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  onContextMenu={(event) => {
                    event.preventDefault();
                    setSelectedMessage(message);
                    setMenuPosition({ x: event.clientX, y: event.clientY });
                    setShowMenu(true);
                  }}
                  style={{
                    background: mine ? "#d9fdd3" : "#ffffff",
                    padding: "10px 12px 8px",
                    borderRadius: mine ? "10px 2px 10px 10px" : "2px 10px 10px 10px",
                    maxWidth: "68%",
                    minWidth: "180px",
                    boxShadow: "0 1px 3px rgba(0,0,0,.16)",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  <div style={{ color: "#075e54", fontWeight: 800, fontSize: "14px" }}>
                    {message.sender_name}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "6px" }}>
                    {message.sender_type} | {message.department}
                  </div>
                  <div style={{ fontSize: "15px", lineHeight: 1.45 }}>
                    {renderMessageBody(message.message)}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      color: "#667085",
                      fontSize: "11px",
                      marginTop: "6px",
                    }}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </section>

        {replyMessage && (
          <div
            style={{
              background: "#f7f8f6",
              borderLeft: "4px solid #25d366",
              padding: "10px 16px",
              display: "flex",
              justifyContent: "space-between",
              gap: "14px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <strong style={{ color: "#075e54" }}>Replying to {replyMessage.sender_name}</strong>
              <div
                style={{
                  color: "#667085",
                  fontSize: "13px",
                  marginTop: "3px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {replyMessage.message}
              </div>
            </div>
            <button
              onClick={() => setReplyMessage(null)}
              style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer" }}
            >
              x
            </button>
          </div>
        )}

        <footer
          style={{
            background: "#f0f2f5",
            padding: "12px 16px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={uploadFile} />

          <button
            onClick={openFilePicker}
            title="Attach file"
            style={{
              background: "white",
              color: "#075e54",
              border: "1px solid #d0d7d2",
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            +
          </button>

          <input
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                editingMessage ? updateMessage() : sendMessage();
              }
            }}
            placeholder={editingMessage ? "Edit message" : `Message ${selectedBranch} church group`}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: "999px",
              border: "1px solid #cfd7d2",
              outline: "none",
              fontSize: "15px",
            }}
          />

          <button
            onClick={editingMessage ? updateMessage : sendMessage}
            style={{
              background: "#25d366",
              color: "#073b31",
              border: "none",
              padding: "14px 22px",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {editingMessage ? "Update" : "Send"}
          </button>
        </footer>
      </main>

      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          style={{ position: "fixed", inset: 0, background: "transparent", zIndex: 999 }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(0,0,0,.24)",
              overflow: "hidden",
              minWidth: "170px",
            }}
          >
            <MenuItem
              label="Reply"
              onClick={() => {
                if (selectedMessage) setReplyMessage(selectedMessage);
                setShowMenu(false);
              }}
            />
            <MenuItem
              label="Copy"
              onClick={() => {
                if (selectedMessage) navigator.clipboard.writeText(selectedMessage.message);
                setShowMenu(false);
              }}
            />
            <MenuItem
              label="Edit"
              onClick={() => {
                if (selectedMessage) {
                  setEditingMessage(selectedMessage);
                  setNewMessage(selectedMessage.message);
                }
                setShowMenu(false);
              }}
            />
            <MenuItem
              label="Delete"
              danger
              onClick={() => {
                if (selectedMessage) deleteMessage(selectedMessage.id);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  label,
  onClick,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        padding: "12px 14px",
        background: "white",
        border: "none",
        borderBottom: "1px solid #edf0ee",
        color: danger ? "#b42318" : "#1f2933",
        textAlign: "left",
        cursor: "pointer",
        fontWeight: danger ? 800 : 500,
      }}
    >
      {label}
    </button>
  );
}
