const autoBind = require('auto-bind');
const config = require('../../utils/config');

class StorageHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(req, h) {
    const { id } = req.params;
    const { cover } = req.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;
    await this._albumsService.addCoverUrl(id, coverUrl);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
    return response;
  }
}

module.exports = StorageHandler;
