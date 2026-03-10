import jwt from 'jsonwebtoken';

export const setupSocketIO = (io) => {
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

    // Notice broadcast
    socket.on('notice:post', (notice) => {
      // simply forward the notice to everyone in the gym room
      io.to(`gym-${socket.gymId}`).emit('notice:received', notice);
    });

    // Real-time updates
    socket.on('status:update', (data) => {
      io.to(`gym-${socket.gymId}`).emit('status:changed', data);
    });

    // Trainer availability
    socket.on('trainer:available', (data) => {
      io.to(`gym-${socket.gymId}`).emit('trainer:updated', data);
    });

    socket.on('disconnect', () => {
      console.log(`✗ User disconnected: ${socket.userId}`);
    });
  });

  return io;
};
