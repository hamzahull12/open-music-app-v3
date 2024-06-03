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

  async postUserAlbumLikesHandler(req, h) {
    const { id: albumId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._service.getAlbumById(albumId);
    await this._service.verifyAlbumLikes(credentialId, albumId);
    await this._service.addAlbumLikes(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Anda Menyukai Album ini',
    }).code(201);
    return response;
  }

  async getAlbumLikesHandler(req) {
    const { id: albumId } = req.params;
    const { values } = await this._service.getAlbumLikes(albumId);

    return {
      status: 'success',
      data: {
        likes: Number(values),
      },
    };
  }

  async deleteAlbumLikesHandler(req) {
    const { id: albumId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._service.deleteAlbumLikes(credentialId, albumId);

    return {
      status: 'success',
      message: 'berhasil membatalkan album yang anda sukai',
    };
  }
}

module.exports = AlbumsHandler;
