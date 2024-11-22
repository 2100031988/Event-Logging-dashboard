import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'events.db'));

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventType TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    sourceAppId TEXT NOT NULL,
    payload TEXT NOT NULL,
    previousHash TEXT NOT NULL,
    hash TEXT UNIQUE NOT NULL
  );
  
  CREATE INDEX IF NOT EXISTS idx_timestamp ON events(timestamp);
  CREATE INDEX IF NOT EXISTS idx_eventType ON events(eventType);
  CREATE INDEX IF NOT EXISTS idx_sourceAppId ON events(sourceAppId);
`);

export default db;