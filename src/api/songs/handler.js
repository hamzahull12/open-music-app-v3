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
    console.log({ data });

    // business logic process
    const songId = await this._service.addSong(data);
    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    }).code(201);
    return response;
  }
}

module.exports = SongsHandler;
