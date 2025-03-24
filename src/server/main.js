import express from "express";
import ViteExpress from "vite-express";
import mysql from "mysql2";
import cors from "cors"; // Import CORS module

const app = express();
const port = 4000;

// app.use(cors()); // Enable CORS for all domains

app.use(cors({
    origin: 'http://3.80.101.187', // Allow only your frontend
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.options('*', cors());  
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "m4nd4r1n4srv",
    multipleStatements: true,
});

// Initialize Database and Tables
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL server.");

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
        console.log("Database and table setup complete.");
    });
});

app.get("/hello", (req, res) => {
    res.send("Hello Vite + React!");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length > 0) {
            res.status(200).json({
                success: true,
                message: "Login successful",
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
    });
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Log the incoming request
    console.log("Received registration request:", { username, password });

    if (!username || !password) {
        console.log("Missing username or password");
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    // Check if the username already exists
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.error("Database error during username check:", err);
                return res
                    .status(500)
                    .json({ success: false, error: "Database error" });
            }

            if (result.length > 0) {
                console.log("Username already exists");
                return res.status(400).json({
                    success: false,
                    error: "Username already exists",
                });
            }

            // Proceed with the registration if the username is available
            db.query(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                [username, password],
                (err, result) => {
                    if (err) {
                        console.error(
                            "Database error during registration:",
                            err
                        );
                        return res.status(500).json({
                            success: false,
                            error: "Failed to register user",
                        });
                    }
                    console.log("User registered successfully");
                    res.status(201).json({
                        success: true,
                        message: "User registered successfully",
                    });
                }
            );
        }
    );
});

// Serve static files from the build (React app)
// app.use(express.static(path.join(__dirname, 'dist')));

// // Catch-all handler for SPA (single-page application) routing
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

ViteExpress.listen(app, port, () => {
    console.log(`Server is listening on http://3.80.101.187:${port} ...`);
});
