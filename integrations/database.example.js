/**
 * MySQL Database Integration Example
 * 
 * This example shows how to connect to MySQL database from Node.js
 * Used for storing and retrieving dynamic content
 */

const mysql = require('mysql2/promise');

class DatabaseService {
  constructor() {
    this.pool = null;
  }

  async connect() {
    if (this.pool) {
      return this.pool;
    }

    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Database connection pool created');
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

// Usage example:
// const db = new DatabaseService();
// const updates = await db.getContentUpdates(5);
// await db.addContentUpdate('blog_post', 'New autonomous update!');
// await db.close();
