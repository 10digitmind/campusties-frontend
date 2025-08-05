// SocketContext.tsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { connectSocket,  disconnectSocket } from "../socketutility/Socket";
import { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ token: string; children: React.ReactNode }> = ({ token, children }) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (token) {
      const sock = connectSocket(token);
      socketRef.current = sock;
    }
    
    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (ctx === null) {
    console.warn("Socket is not connected yet.");
  }
  return ctx;
};

