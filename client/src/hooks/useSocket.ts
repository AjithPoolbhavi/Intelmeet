import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const { token } = useAuthStore();

  const getSocket = useCallback((): Socket => {
    if (!socketInstance) {
      socketInstance = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling'],
      });
    }
    return socketInstance;
  }, [token]);

  const disconnect = useCallback(() => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  }, []);

  return { getSocket, disconnect };
};
