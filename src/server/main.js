import express from "express";
import ViteExpress from "vite-express";
import mysql from "mysql2";
import cors from "cors"; // Import CORS module
import bcrypt from 'bcryptjs';

const app = express();
const port = 4004;

// app.use(cors()); // Enable CORS for all domains

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "m4nd4r1n4srv",
    multipleStatements: true,
});

function setupDatabase(db) {
    const createDB = `CREATE DATABASE IF NOT EXISTS mandarina;`;
    const useDB = `USE mandarina;`;
    const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL    
        );`;
    const taskTable =` 
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            description TEXT,
            dueDate DATE,
            priority ENUM('Low', 'Medium', 'High'),
            status ENUM('Pending', 'In Progress', 'Completed'),
            hour int,
            minute int,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`;
    const setupQueries = `${createDB} ${useDB} ${usersTable} ${taskTable}`;

    db.query(setupQueries, (err) => {
        if (err) throw err;
        console.log("Database and table setup complete.");
    });
}

// Initialize Database and Tables
setupDatabase(db);

app.get("/hello", (req, res) => {
    res.send("Hello Vite + React!");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log("Received login request:", { username, password });

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


    if (password.length < 8) {
        console.log("Password must be at least 8 characters long");
        return res
           .status(400)
           .json({ error: "Password must be at least 8 characters long" });
    }

    // Hash the password
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        
        db.query(
            `INSERT INTO users (username, password) VALUES (?, ?)`,
            [username, hashed],
            (err, results)  => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).json({
                        success: false,
                        error: "Internal Server Error",
                    });
                }
                console.log("User registered successfully");
                res.status(201).json({
                    success: true,
                    message: "User registered successfully",
                });
            } 
        )
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    } 


    // Check if the username already exists
});

// Serve static files from the build (React app)
// app.use(express.static(path.join(__dirname, 'dist')));

// // Catch-all handler for SPA (single-page application) routing
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

ViteExpress.listen(app, port, () => {
    console.log(`Server is listening on http://localhost:${port} ...`);
});
