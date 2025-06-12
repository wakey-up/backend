const handler = require('./handler');

module.exports = [
  {
    method: 'POST',
    path: '/register',
    options: { auth: false },
    handler: handler.register,
  },
  {
    method: 'POST',
    path: '/login',
    options: { auth: false },
    handler: handler.login,
  },
  {
    method: 'GET',
    path: '/profile',
    handler: handler.profile,
  },
];
