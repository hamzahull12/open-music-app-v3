const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postRegisterUsers,
  },
];

module.exports = routes;
