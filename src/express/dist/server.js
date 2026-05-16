import express, {} from "express";
import { Pool } from "pg";
import config from "./config";
const app = express();
const port = config.port;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const pool = new Pool({
    connectionString: config.databaseUrl,
});
const initDB = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        console.log("Database initialized successfully");
    }
    catch (error) {
        console.error("Error initializing database:", error);
    }
};
initDB();
app.get("/", (req, res) => {
    res.status(200).send({
        message: "Hello Express Expert!",
    });
});
app.post("/users", async (req, res) => {
    try {
        const { name, email, is_active, age, password } = req.body;
        const result = await pool.query(`
      INSERT INTO users(name, email, is_active, age, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `, [name, email, is_active, age, password]);
        res.status(201).send({
            message: "Created user successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Something went wrong",
        });
    }
});
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT * FROM users`);
        res.status(200).send({
            message: "Fetched users successfully",
            data: result.rows,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Something went wrong",
            error: error
        });
    }
});
app.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
        SELECT * FROM users WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send({
                message: "User not found",
                data: null
            });
        }
        res.status(200).send({
            message: "Fetched user successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Something went wrong",
            error: error
        });
    }
});
app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, is_active, age, password } = req.body;
        const result = await pool.query(`
            UPDATE users 
            SET name = COALESCE($1, name),
            email = COALESCE($2, email), 
            is_active = COALESCE($3, is_active), 
            age = COALESCE($4, age), 
            password = COALESCE($5, password), 
            updated_at = NOW()




            WHERE id = $6
            RETURNING *
        `, [name, email, is_active, age, password, id]);
        if (result.rows.length === 0) {
            return res.status(404).send({
                message: "User not found",
                data: null
            });
        }
        res.status(200).send({
            message: "Updated user successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).send({
            message: error.message || "Something went wrong",
            error: error
        });
    }
});
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send({
                message: "User not found",
                data: null
            });
        }
        res.status(200).send({
            message: "Deleted user successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).send({
            message: error.message || "Something went wrong",
            error: error
        });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=server.js.map