const users = require('../models/users');

module.exports = (server) => {
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 3600,
    },
    validate: (artifacts, request, h) => {
      const user = users.findById(artifacts.decoded.payload.id);
      return {
        isValid: !!user,
        credentials: { user },
      };
    },
  });

  server.auth.default('jwt');
};
