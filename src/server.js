require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const userRoutes = require('./api/users/routes');
const jwtStrategy = require('./auth/jwt');

const init = async () => {
  const port = process.env.PORT || 3000;
  const server = Hapi.server({
    port, // <--- Sekarang pakai port 3000 untuk backend Hapi.js
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['http://localhost:5173'], // <--- Ini harus port frontend React lo
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['X-Requested-With'],
        credentials: true
      }
    }
  });

  await server.register(Jwt);
  jwtStrategy(server);

  server.route(userRoutes);

  await server.start();
  console.log(`🚀 Server jalan di ${server.info.uri}`);
};

init();