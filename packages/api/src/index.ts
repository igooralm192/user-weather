import app from './app';
import { env } from './config/env';

const PORT = parseInt(env.PORT, 10);

const server = app.listen(PORT, () => {
  if (env.NODE_ENV === 'development') {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${env.NODE_ENV}`);
    console.log(`🔑 Weather API Key: ${env.WEATHER_API_KEY}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default server;
