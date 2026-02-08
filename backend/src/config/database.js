const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS counter (
        id VARCHAR(50) PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Inicializace počítadla, pokud neexistuje
    await pool.query(`
      INSERT INTO counter (id, value)
      VALUES ('main', 0)
      ON CONFLICT (id) DO NOTHING
    `);
    
    console.log('PostgreSQL připojeno úspěšně');
  } catch (error) {
    console.error('PostgreSQL chyba připojení:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, initDB };
