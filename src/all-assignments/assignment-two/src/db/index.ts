import { Pool } from 'pg';
import { config } from '../config/index.js';

const pool = new Pool({
  connectionString: config.database.url,
});

export default pool;
