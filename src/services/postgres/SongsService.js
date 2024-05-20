const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

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
    album_id,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      values: [id, title, year, performer, genre, duration, album_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Gagal Menambahkan Lagu');

    return result.rows[0].id;
  }
}

module.exports = SongsService;
