const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToGetSongs, mapDBToGetByIdSongs } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Gagal Menambahkan Lagu');

    return result.rows[0].id;
  }

  async getAllSongs() {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToGetSongs);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal, Id tidak ditemukan');

    return mapDBToGetByIdSongs(result.rows[0]);
  }

  async updateSongById(id, {
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const query = {
      text: `UPDATE songs SET title = $1, 
      year = $2, performer = $3, genre = $4,
      duration = $5 WHERE id = $6`,
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal mengubah lagu, Id tidak ditemukan');
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal menghapus lagu, Id tidak ditemukan');
  }
}

module.exports = SongsService;
