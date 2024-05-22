const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postRegisterUsers(req, h) {
    this._validator.validateUserPayload(req.payload);

    const data = req.payload;

    const userId = await this._service.addUser(data);

    const response = h.response({
      status: 'success',
      data: {
        userId,
      },
    }).code(201);
    return response;
  }
}

module.exports = UsersHandler;
