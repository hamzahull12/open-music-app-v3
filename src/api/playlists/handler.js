const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(req, h) {
    this._validator.validatePlaylistPayload(req.payload);

    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    }).code(201);
    return response;
  }

  async getPlaylistHandler(req) {
    const { id: credentialId } = req.auth.credentials;

    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistsHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylist(playlistId);

    return {
      status: 'success',
      message: 'playlist berhasil dihapus',
    };
  }

  // ====================playlist_songs======================== //

  async postSongInPlaylistsHandler(req, h) {
    this._validator.validatePlaylistSongsPayload(req.payload);

    const { id: playlistId } = req.params;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.addSongInPlaylist(playlistId, songId);

    // ========== Log Activities ========== //
    await this._service.addActivitiesLog(playlistId, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'lagu berhasil ditambahkan ke playlist anda',
    }).code(201);
    return response;
  }

  async getDetailPlaylistsHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    const playlist = await this._service.getDetailPLaylistSongs(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongInPlaylistHandler(req) {
    this._validator.validatePlaylistSongsPayload(req.payload);

    const { id: playlistId } = req.params;
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteSongInPlaylists(songId);
    await this._service.addActivitiesLog(playlistId, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Data berhasil dihapus',
    };
  }

  // ============== activities log GET ============ //

  async getLogActivitiesHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    const activities = await this._service.getLogActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
