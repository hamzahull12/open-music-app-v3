const Joi = require('joi');

const ExportPlaylistSong = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPlaylistSong;
