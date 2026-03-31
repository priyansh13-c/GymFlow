import jwt from 'jsonwebtoken';

let ioInstance;

export const setupSocketIO = (io) => {
  ioInstance = io;
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.role = decoded.role;
      socket.gymId = decoded.gymId;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  // Socket event handlers
  io.on('connection', (socket) => {
    console.log(`✓ User connected: ${socket.userId}`);

    // Join gym-specific room
    if (socket.gymId) {
      socket.join(`gym-${socket.gymId}`);
    }

    // Explicit room join for users who might not have gymId in token initially
    socket.on('join:gym', (gymId) => {
      socket.join(`gym-${gymId}`);
      socket.gymId = gymId;
    });

    // Notice broadcast
    socket.on('notice:post', (notice) => {
      // simply forward the notice to everyone in the gym room
      if (socket.gymId) {
        io.to(`gym-${socket.gymId}`).emit('notice:received', notice);
      }
    });

    // Real-time updates
    socket.on('status:update', (data) => {
      if (socket.gymId) {
        io.to(`gym-${socket.gymId}`).emit('status:changed', data);
      }
    });

    // Trainer availability
    socket.on('trainer:available', (data) => {
      if (socket.gymId) {
        io.to(`gym-${socket.gymId}`).emit('trainer:updated', data);
      }
    });

    socket.on('disconnect', () => {
      console.log(`✗ User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized!');
  }
  return ioInstance;
};
