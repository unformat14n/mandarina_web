import express from "express";
import ViteExpress from "vite-express";
import mysql from "mysql2"; 
import cors from "cors"; // Import CORS module
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4004;

const SECRET_KEY = process.env.SECRET_KEY;

// app.use(cors()); // Enable CORS for all domains

app.use(express.json());
app.use(cors());
let verificationCodes = {};

// Regular expressions for input validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;
const noSpaces = /^\S*$/; // No spaces allowed

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

function validatePassword(password) {
    if (password.length < 8) {
        return {
            isValid: false,
            error: "Password must be at least 8 characters long"
        };
    }
    
    if (!hasUppercase.test(password)) 
        return {
            isValid: false,
            error: "Password must contain at least one uppercase letter"
        };

    if (!hasNumber.test(password))
        return {
            isValid: false,
            error: "Password must contain at least one number"
        };
        
    if (!noSpaces.test(password))
        return {
            isValid: false,
            error: "Password must not contain spaces"   
        }

    return { isValid: true };
}

// Initialize Database and Tables
setupDatabase(db);

app.get("/hello", (req, res) => {
    res.send("Hello Vite + React!");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password });

    // Input validation - empty
    if (!email || !password ) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid input, empty fields" 
        });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

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
                const token = jwt.sign({ email: results[0].email, id: results[0].id }, SECRET_KEY, {
                    expiresIn: '2h', // Token expiration time
                })
                console.log("Information correct");
                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    token: token,
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

    // Validate that input isn't empty
    if (!email || !password) {
        console.log("Missing username or password");
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    // Email format validation
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            error: "Invalid email format" 
        });
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        console.log(passwordValidation.error);
        return res.status(400).json({ 
            success: false,
            error: passwordValidation.error 
        });
    }

    // Check if the username already exists
    const checkEmailQuery = "SELECT 1 FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error", 
            })
        }
        if (results.length > 0) {
            console.log("Email already exists");
            return res.status(400).json({
                success: false,
                error: "Email already exists",
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
        // Ensure only one response is sent
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Failed to send email.' });
        }
    }
});

app.post('/verify', async (req, res) => {
    const { email, password, code } = req.body;
    console.log("Received verification request:", { email, password, code });
    console.log("Stored code:", verificationCodes[email]); // Log the stored code for verificatio

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

                    const token = jwt.sign(
                        { email: email, id: results.insertId }, 
                        SECRET_KEY,
                        { expiresIn: '2h' }  // Token expiration time
                    );

                    delete verificationCodes[email]; // Clear the temp code
                    res.status(201).json({
                        success: true,
                        message: "Code correct, user registered successfully",
                        token: token,
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
