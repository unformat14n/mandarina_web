import express from "express";
import ViteExpress from "vite-express";
import mysql from "mysql2";
import path from 'path';

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'm4nd4r1n4srv',
    multipleStatements: true
});

// Initialize Database and Tables
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL server.');

    const createDB = `CREATE DATABASE IF NOT EXISTS mandarina;`;
    const useDB = `USE mandarina;`;
    const createTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `;
    const insertSampleData = `
        INSERT INTO users (username, password)
        SELECT 'testuser', 'password123' FROM DUAL
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'testuser');
    `;
    const setupQueries = `${createDB} ${useDB} ${createTable} ${insertSampleData}`;

    db.query(setupQueries, (err) => {
        if (err) throw err;
        console.log('Database and table setup complete.');
    });
});

app.get("/hello", (req, res) => {
    res.send("Hello Vite + React!");
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length > 0) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to register user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        }
    );
});

// Serve static files from the build (React app)
// app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all handler for SPA (single-page application) routing
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

ViteExpress.listen(app, port, () => {
    console.log(`Server is listening on http://localhost:${port} ...`)
});
