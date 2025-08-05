import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/message.css'
import { ConversationSummary } from './AppTypes/User';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from "framer-motion";
import Chat from './Chat';

const API_URL =process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem('token')
function Message() {
    const navigate = useNavigate();
    

    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true)


  
    useEffect(() => {
      const fetchConversations = async () => {
        setLoading(true); // ✅ Ensure loading starts
    
        try {
          const res = await axios.get(`${API_URL}/getUserConversations`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (!res || !res.data) throw new Error('Failed to fetch');
    console.log(res.data)
          setConversations(res.data);
        } catch (err) {
          console.error('Error loading conversations:', err);
        } finally {
          setLoading(false); // ✅ Always stop loading
        }
      };
    console.log(selectedUserId)
      fetchConversations();
    }, [selectedUserId]);
    
  
  
    const goToChat = (conversationId: string) => {
      navigate(`/chat/${conversationId}`);
    };
  
   
    return (
      <>
        <div className="chat-list">
          <h2>Your Conversations</h2>
    
          {loading ? (
            <p>Loading...</p>
          ) : conversations.length === 0 ? (
            <p>No chats yet.</p>
          ) : (
            conversations.map((chat) => {
              const lastMsg = chat.lastMessage;
    
              return (
                <div
                  key={chat.conversationId}
                  className="chat-item"
                  onClick={() => setSelectedUserId(chat.otherUser._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={chat.otherUser.profilePhoto}
                    alt={chat.otherUser.userName}
                    style={{ width: 50, height: 50, borderRadius: '50%' }}
                  />
                  <div>
                    <strong>{chat.otherUser.userName}</strong>
                    <p style={{ margin: 0, color: '#555' }}>
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.content}` : 'No messages yet'}
                    </p>
                    <small style={{ color: '#999' }}>
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleString() : ''}
                    </small>
                  </div>
                </div>
              );
            })
          )}
        </div>
    
        {/* Inline Chat Panel */}
        <AnimatePresence>
          {selectedUserId && (
            <motion.div
              className="chat-modal"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                height: "100vh",
                width: "100%",
                maxWidth: "450px",
                background: "#fff",
                boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <button
                onClick={() => setSelectedUserId(null)}
                style={{
                  alignSelf: "flex-end",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  padding: "1rem",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
              <Chat OtherUserId={selectedUserId} />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
    
    
};

  

export default Message