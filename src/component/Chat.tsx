import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getSocket } from "../component/Utility/socketutility/Socket"
import "../styles/chat.css"; // Load your gold-white-black CSS
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/hook'; 

type Message = {
    _id?: string; // optional if not saved to DB yet
    chatId: string;
    senderId: string;
    content: string;
    senderName?:string;
    timestamp: string;
};





const Chat: React.FC= () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [loading, setLoading] = useState(true); // default is loading

 

  const chatEndRef = useRef<HTMLDivElement>(null);
     const currentUser = useAppSelector(state => state.user.user);
     const matches = useAppSelector((state) => state.user.matches);
const {OtherUserId} =useParams()




  // Step 1: Start chat room on mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
         'http://localhost:5000/api/start-chat', // Adjust if route differs
          { OtherUserId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChatId(res.data.chat._id);
     

      } catch (error: any) {
        console.error("Chat init failed:", error.response?.data?.message || error.message);
        console.log(error)
      }
    };
    if (OtherUserId) initializeChat();
  }, [OtherUserId]);

  useEffect(() => {
    const socket = getSocket();
  
   
  
    socket?.on("receive_message", ({ message }) => {
        setMessages((prev) => [...prev, message]);
      });
      
      return () => {
        socket?.off("receive_message"); // ✅ Correct way to clean up
      };
  }, []);
  
  useEffect(() => {
    const socket = getSocket();
  
    if (chatId) {
      socket?.emit("join_chat", { chatId });
    }
  }, [chatId]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchMessages = async () => {
        try {
            setLoading(true); // Start loading
            const res = await axios.get(
              `http://localhost:5000/api/get-chat/${chatId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setMessages(res.data.messages);
          } catch (error) {
            console.error("❌ Failed to load messages:", error);
          } finally {
            setLoading(false); // Stop loading
          }
    };
  
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);
  
  
  

  // Step 2: Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages,]);

  const handleSend = () => {
    if (!input.trim()) return;
  
    const newMessage: Message = {
        chatId: chatId as string,
        senderId: currentUser?._id as string,
        content: input,
        senderName:currentUser?.userName,
        timestamp: new Date().toISOString(), // match your backend format
      };
      const socket = getSocket();

    // Emit message to server
    socket?.emit("send_message", newMessage);

    // Update UI immediately (optimistic update)
   
    
   
    setInput(""); // Clear input
  };

  const formatTime = (timestamp: string | Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const otherName = matches?.find(match => match.otherUser._id === OtherUserId)?.otherUser.userName || "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    const socket = getSocket();
    // Notify server user is typing
    socket?.emit("typing", { chatId, userId: currentUser?._id });
  };
  
  React.useEffect(() => {
    const socket = getSocket();
if(socket){
   
    socket?.on("typing", ({ userId }) => {
        if (userId !== currentUser?._id) {
          setIsTyping(true);
          // Hide typing after a delay if no new typing event comes
          setTimeout(() => setIsTyping(false), 2000);
        }
      });
}
     
    return () => {
      socket?.off("typing");
    };
  }, [currentUser?._id]);

 
  return (
  
  <>
 
    <div className="chat-container">
      <div className="chat-header">Your  conversation {otherName?otherName:'other user'} </div>
  
      <div className="chat-messages">
  {loading ? (
    <div className="loading-indicator">Loading messages...</div>
  ) : (
    messages.map((msg, idx) => (
      <div
        key={idx}
        className={`message ${
          msg.senderId === currentUser?._id ? "you" : "other"
        }`}
      >
        <div className="message-header">
          <strong>{msg.senderName}</strong>{" "}
          <span className="message-time">{formatTime(msg.timestamp)}</span>
        </div>
        <div className="message-content">{msg.content}</div>
      </div>
    ))
  )}
  <div ref={chatEndRef} />
</div>

      {isTyping && (
  <div className="typing-indicator">
    <span>{isTyping} is typing</span>
    <span className="dot"></span>
    <span className="dot"></span>
    <span className="dot"></span>
  </div>
)}

      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
    </>
  );
};

export default Chat;
