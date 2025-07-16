// SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, getSocket, disconnectSocket } from "../socketutility/Socket";
import { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ token: string; children: React.ReactNode }> = ({ token, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const sock = connectSocket(token);
    setSocket(sock);

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("Socket not initialized. Use within <SocketProvider />");
  return ctx;
};
