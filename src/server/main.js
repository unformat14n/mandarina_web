import express from "express";
import ViteExpress from "vite-express";
import mysql from "mysql2";
import cors from "cors"; // Import CORS module
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const app = express();
const port = 4004;

// app.use(cors()); // Enable CORS for all domains

app.use(express.json());
app.use(cors());
let verificationCodes = {};

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "m4nd4r1n4srv",
    multipleStatements: true,
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  // Gmail SMTP server
    port: 587,               // Use 587 for TLS (recommended)
    secure: false,           // `false` for TLS, `true` for SSL (port 465)
    auth: {
        user: "mandarina.task.manager@gmail.com",  // Your email
        pass: "phrb ltjj eedb lckn "   // Your app password (not your regular password)
    }
});

async function sendVerificationEmail(email, code) {
    try {
        await transporter.sendMail({
            from: `"Mandarina" <mandarina.task.manager@gmail.com>`,
            to: email,
            subject: 'Your Verification Code',
            text: `
                Hello ${email}, welcome to Mandarina!
                You are almost there!
                Please use the following verification code to complete your registration:
                Your verification code is: ${code}
            `
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

function setupDatabase(db) {
    const createDB = `CREATE DATABASE IF NOT EXISTS mandarina;`;
    const useDB = `USE mandarina;`;
    const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(50) NOT NULL UNIQUE,
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

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password });

    const query = "SELECT * FROM users WHERE email = ?;";
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].password);
            if (!match) {
                console.log("Invalid password");
                return res.status(401).json({
                    success: false,
                    message: "Password did not match the stored hash",
                });
            } else {
                console.log("Information correct");
                res.status(200).json({
                    success: true,
                    message: "Login successful",
                });
            }
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
    });
});

app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    // Log the incoming request
    console.log("Received registration request:", { email, password });

    if (!email || !password) {
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

    // Check if the username already exists
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
            console.error("Error checking username:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error", 
            })
        }
        if (results.length > 0) {
            console.log("Username already exists");
            return res.status(400).json({
                success: false,
                error: "Username already exists",
            });
        }
    })

    // Generate a 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code temporarily
    verificationCodes[email] = verificationCode;
    try {
        await sendVerificationEmail(email, verificationCode);
        console.log('Email sent:', email);
        res.status(201).json({
            success: true,
            message: "Allow verification. Email sent!",
        })
    } catch (error) {
        console.error('Email error:', error);
        res.json({ success: false, message: 'Failed to send email.' });
    }
});

app.post('/verify', async (req, res) => {
    const { email, password, code } = req.body;

    if (verificationCodes[email] === code) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            
            db.query(
                `INSERT INTO users (email, password) VALUES (?, ?)`,
                [email, hashed],
                (err, results)  => {
                    if (err) {
                        console.error("Error inserting user:", err);
                        return res.status(500).json({
                            success: false,
                            error: "Internal Server Error",
                        });
                    }
                    console.log("User registered successfully");
                    delete verificationCodes[email]; // Clear the temp code
                    res.status(201).json({
                        success: true,
                        message: "Code correct, user registered successfully",
                    });
                } 
            )
        } catch (error) {
            console.error("Error during validation:", error);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    } else {
        res.json({ success: false, message: 'Invalid verification code.' });
    }
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
