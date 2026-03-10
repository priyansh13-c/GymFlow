import io from 'socket.io-client';
import { useEffect, useState } from 'react';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✓ Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('✗ Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Hook to use socket in React components
export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !socket) {
      const newSocket = initializeSocket(token);
      setSocketInstance(newSocket);
    } else if (socket) {
      setSocketInstance(socket);
    }

    return () => {
      // Don't disconnect on unmount, just return the socket
    };
  }, []);

  return socketInstance;
};

// Socket event listeners
export const onNoticeReceived = (callback) => {
  if (socket) {
    socket.on('notice:received', callback);
  }
};

export const onStatusChanged = (callback) => {
  if (socket) {
    socket.on('status:changed', callback);
  }
};

export const onTrainerUpdated = (callback) => {
  if (socket) {
    socket.on('trainer:updated', callback);
  }
};

// Socket event emitters
export const emitNoticePost = (notice) => {
  if (socket) {
    socket.emit('notice:post', notice);
  }
};

export const emitStatusUpdate = (data) => {
  if (socket) {
    socket.emit('status:update', data);
  }
};

export const emitTrainerAvailable = (data) => {
  if (socket) {
    socket.emit('trainer:available', data);
  }
};
