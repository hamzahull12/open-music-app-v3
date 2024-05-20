const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(req, h) {
    // validaton payload data
    this._validator.albumValidatePayload(req.payload);

    // business logic process
    const albumId = await this._service.addAlbum(req.payload);

    // response send to client
    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    }).code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
