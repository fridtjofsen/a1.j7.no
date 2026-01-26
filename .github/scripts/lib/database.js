const mysql = require('mysql2/promise');

class DatabaseService {
  constructor() {
    this.pool = null;
    // Map provided secrets to config
    this.config = {
      host: process.env.MYSQL_SERVER || process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME || process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: 'a1j7no', // Default database name from SETUP.md
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
  }

  async initialize() {
    if (this.pool) return;

    // First, connect without specifying a database to avoid access denied errors
    const tempConfig = { ...this.config };
    delete tempConfig.database;
    
    let tempConnection;
    try {
      // Create a temporary connection without database
      tempConnection = await mysql.createConnection(tempConfig);
      
      // Check if database exists
      const [databases] = await tempConnection.query(
        'SHOW DATABASES LIKE ?',
        [this.config.database]
      );
      
      // Note: Database identifiers cannot be parameterized, so we use escapeId
      const dbName = mysql.escapeId(this.config.database);
      
      if (databases.length === 0) {
        console.log(`Database ${this.config.database} does not exist. Attempting to create it...`);
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`Database ${this.config.database} created`);
      }
      
      // Select the database
      await tempConnection.query(`USE ${dbName}`);
      console.log(`Connected to database ${this.config.database}`);
      
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    } finally {
      if (tempConnection) await tempConnection.end();
    }

    // Now create the pool with the database specified
    this.pool = mysql.createPool(this.config);
    await this.ensureSchema();
  }

  async ensureSchema() {
    const connection = await this.pool.getConnection();
    try {
        // Tables from SETUP.md
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
