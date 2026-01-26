const mysql = require('mysql2/promise');

class DatabaseService {
  constructor() {
    this.pool = null;
    // Map provided secrets to config
    this.config = {
      host: process.env.MYSQL_SERVER || process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME || process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || 'j7nor02', // Default database name from SETUP.md, but prefer env var
      waitForConnections: true,
      connectionLimit: 1, // Restricted by hosting provider (max 10 user connections, strict rate limits)
      queueLimit: 0
    };
  }

  async initialize() {
    if (this.pool) return;

    try {
      // Create the pool directly with the database specified.
      // We assume the database exists and is assigned by the hosting provider.
      // We cannot create databases or choose names due to permissions.
      this.pool = mysql.createPool(this.config);
      
      console.log(`Connected to database ${this.config.database}`);
      await this.ensureSchema();
      
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async ensureSchema() {
    const connection = await this.pool.getConnection();
    try {
        // Tables from SETUP.md
        // We use CREATE TABLE IF NOT EXISTS which is generally allowed within the assigned DB
        await connection.query(`
            CREATE TABLE IF NOT EXISTS content_updates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                content_type VARCHAR(50),
                content TEXT,
                status VARCHAR(20),
                created_by VARCHAR(50)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS site_analytics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                event_type VARCHAR(50),
                event_data JSON,
                user_agent TEXT
            )
        `);
        console.log('Schema ensured');
    } catch (error) {
        console.error('Failed to ensure schema:', error);
        throw error;
    } finally {
        connection.release();
    }
  }

  async connect() {
    if (!this.pool) {
      await this.initialize();
    }
    return this.pool;
  }

  async getContentUpdates(limit = 10) {
    const pool = await this.connect();
    const [rows] = await pool.execute(
      'SELECT * FROM content_updates ORDER BY update_date DESC LIMIT ?',
      [limit]
    );
    return rows;
  }

  async addContentUpdate(contentType, content, createdBy = 'autonomous') {
    const pool = await this.connect();
    const [result] = await pool.execute(
      'INSERT INTO content_updates (content_type, content, status, created_by) VALUES (?, ?, ?, ?)',
      [contentType, content, 'published', createdBy]
    );
    return result.insertId;
  }

  async trackAnalytics(eventType, eventData) {
    const pool = await this.connect();
    const [result] = await pool.execute(
      'INSERT INTO site_analytics (event_type, event_data, user_agent) VALUES (?, ?, ?)',
      [eventType, JSON.stringify(eventData), eventData.userAgent || 'unknown']
    );
    return result.insertId;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Database connection pool closed');
    }
  }
}

module.exports = DatabaseService;
