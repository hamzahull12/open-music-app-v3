const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(req, h) {
    this._validator.validateCollaboratorPayload(req.payload);

    const { playlistId, userId } = req.payload;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaborations(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    }).code(201);
    return response;
  }

  async deleteCollaborationHandler(req) {
    this._validator.validateCollaboratorPayload(req.payload);

    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);
    return {
      status: 'success',
      message: 'collaboration has deleted',
    };
  }
}

module.exports = CollaborationsHandler;
