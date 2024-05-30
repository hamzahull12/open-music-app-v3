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
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongInAlbum(id);

    // send response to client
    return {
      status: 'success',
      data: {
        // optional v1 get songs in album with spread two var
        album: {
          ...album,
          songs,
        },
      },
    };
  }

  async putAlbumByIdHandler(req) {
    // validaton payload data
    this._validator.albumValidatePayload(req.payload);

    // accommodate parameter values based on id
    const { id } = req.params;

    // business logic process for Update data
    await this._service.updateAlbumById(id, req.payload);

    // send response to client
    return {
      status: 'success',
      message: 'Album Berhasil di Perbarui',
    };
  }

  async deleteAlbumByIdHandler(req) {
    // accommodate parameter values based on id
    const { id } = req.params;

    await this._service.deleteAlbumById(id);

    // send response to client
    return {
      status: 'success',
      message: 'Album Berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
