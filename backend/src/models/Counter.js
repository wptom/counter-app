const { pool } = require('../config/database');

class Counter {
  // Získat aktuální hodnotu počítadla
  static async getCounter() {
    const result = await pool.query(
      'SELECT value FROM counter WHERE id = $1',
      ['main']
    );
    return result.rows[0];
  }

  // Zvýšit počítadlo
  static async increment() {
    const result = await pool.query(
      'UPDATE counter SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING value',
      ['main']
    );
    return result.rows[0];
  }

  // Snížit počítadlo
  static async decrement() {
    const result = await pool.query(
      'UPDATE counter SET value = value - 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING value',
      ['main']
    );
    return result.rows[0];
  }
}

module.exports = Counter;
