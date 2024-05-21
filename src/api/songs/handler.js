const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(req, h) {
    // validaton payload data
    this._validator.songValidatePayload(req.payload);

    const data = req.payload;

    // business logic process
    const songId = await this._service.addSong(data);

    // send response to client
    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    }).code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getAllSongs();

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(req) {
    const { id } = req.params;

    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }
}

module.exports = SongsHandler;
