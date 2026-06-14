import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.databaseUrl,
});
  

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        age INT,
        role VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS profile(
        id SERIAL PRIMARY KEY, 
        user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        bio TEXT,
        address VARCHAR(255),
        phone VARCHAR(20),
        gender VARCHAR(20),

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};


