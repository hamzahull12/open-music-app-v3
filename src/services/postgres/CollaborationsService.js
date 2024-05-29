const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaborations(playlistId, userId) {
    await this.checkUserCollaborator(userId);
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan collabolator');
    }
    return result.rows[0].id;
  }

  async verifyCollabolator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new InvariantError('Colaborator gagal diverifikasi');

    return result.rows[0].id;
  }

  async checkUserCollaborator(userId) {
    const result = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };
    const userResult = await this._pool.query(result);
    if (!userResult.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('gagal menghapus kolaborator');
  }
}

module.exports = CollaborationsService;
