const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(req, h) {
    this._validator.validateExportPlaylistPayload(req.payload);

    const { playlistId } = req.params;
    const { id: owner } = req.auth.credentials;
    const { targetEmail } = req.payload;
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    const playlist = await this._playlistsService.getDetailPLaylistSongs(playlistId);
    const message = {
      userId: owner,
      playlistId,
      targetEmail,
      playlist,
    };
    await this._service.sendMessage('playlist', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
