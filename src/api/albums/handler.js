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

  async getAlbumByIdHandler(req) {
    // accommodate parameter values based on id
    const { id } = req.params;

    // business logic process for get data
    const album = await this._service.getNoteById(id);

    // send response to client
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }
}

module.exports = AlbumsHandler;
