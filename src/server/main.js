import express from "express";
import ViteExpress from "vite-express";
import mysql from "mysql2";
import * as dbOps from "./dbOps.js";
import cors from "cors"; // Import CORS module
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 4000;

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
    host: "smtp.gmail.com", // Gmail SMTP server
    port: 587, // Use 587 for TLS (recommended)
    secure: false, // `false` for TLS, `true` for SSL (port 465)
    auth: {
        user: "mandarina.task.manager@gmail.com", // Your email
        pass: "phrb ltjj eedb lckn ", // Your app password (not your regular password)
    },
});

async function sendVerificationEmail(email, code) {
    try {
        await transporter.sendMail({
            from: `"Mandarina" <mandarina.task.manager@gmail.com>`,
            to: email,
            subject: "Your Verification Code",
            text: `
                Hello ${email}, welcome to Mandarina!
                You are almost there!
                Please use the following verification code to complete your registration:
                Your verification code is: ${code}
            `,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

function validatePassword(password) {
    if (password.length < 8) {
        return {
            isValid: false,
            error: "Password must be at least 8 characters long",
        };
    }

    if (!hasUppercase.test(password))
        return {
            isValid: false,
            error: "Password must contain at least one uppercase letter",
        };

    if (!hasNumber.test(password))
        return {
            isValid: false,
            error: "Password must contain at least one number",
        };

    if (!noSpaces.test(password))
        return {
            isValid: false,
            error: "Password must not contain spaces",
        };

    return { isValid: true };
}

// Initialize Database and Tables
dbOps.setupDatabase(db);

app.get("/hello", (req, res) => {
    res.send("Hello Vite + React!");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password });

    // Input validation - empty
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Invalid input, empty fields",
        });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format",
        });
    }

    dbOps.getUserByEmail(db, email, async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].password);
            if (!match) {
                console.log("Invalid password");
                return res.status(401).json({
                    success: false,
                    message:
                        "Your email or password is incorrect. Please try again",
                });
            } else {
                const token = jwt.sign(
                    { email: results[0].email, id: results[0].id },
                    SECRET_KEY,
                    {
                        expiresIn: "2h", // Token expiration time
                    }
                );
                console.log(results[0]);
                console.log("Information correct");
                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    id: results[0].id,
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
            error: "Invalid email format",
        });
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        console.log(passwordValidation.error);
        return res.status(400).json({
            success: false,
            error: passwordValidation.error,
        });
    }

    // Check if the username already exists
    try {
        // Check if the username already exists (promisified version)
        const emailExists = await new Promise((resolve, reject) => {
            dbOps.checkEmail(db, email, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0);
                }
            });
        });

        if (emailExists) {
            console.log("Email already exists");
            return res.status(400).json({
                success: false,
                error: "Email already exists",
            });
        }

        // Generate a 6-digit code
        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Store the code temporarily
        verificationCodes[email] = verificationCode;

        await sendVerificationEmail(email, verificationCode);
        console.log("Email sent:", email);

        res.status(201).json({
            success: true,
            message: "Allow verification. Email sent!",
        });
    } catch (error) {
        console.error("Error in registration:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: error.message || "Registration failed",
            });
        }
    }
});

app.post("/verify", async (req, res) => {
    const { email, password, code } = req.body;
    console.log("Received verification request:", { email, password, code });
    console.log("Stored code:", verificationCodes[email]); // Log the stored code for verificatio

    if (verificationCodes[email] === code) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            dbOps.addUser(db, email, hashed, async (err, results) => {
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
                    { expiresIn: "2h" } // Token expiration time
                );

                delete verificationCodes[email]; // Clear the temp code
                res.status(201).json({
                    success: true,
                    message: "Code correct, user registered successfully",
                    token: token,
                    id: results.insertId,
                });
            });
        } catch (error) {
            console.error("Error during validation:", error);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    } else {
        res.json({ success: false, message: "Invalid verification code." });
    }
});

app.post("/create-task", async (req, res) => {
    const {
        title,
        description,
        dueDate,
        priority,
        status,
        hour,
        minute,
        userId,
    } = req.body;

    dbOps.createTask(
        db,
        title,
        description,
        dueDate,
        priority,
        status,
        hour,
        minute,
        userId,
        async (err, results) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({
                    success: false,
                    error: "Internal Server Error" + err,
                });
            }
            console.log("Task succesfully inserted");

            res.status(201).json({
                success: true,
                message: "Task inserted successfully",
            });
        }
    );
});

app.post("/get-tasks", async (req, res) => {
    const { userId } = req.body;

    dbOps.getTasksByUserID(db, userId, async (err, results) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            tasks: results,
        });
    });
});

app.post("/update-task", async (req, res) => {
    const { title, description, dueDate, priority, hour, minute, taskId } =
        req.body;
    dbOps.updateTasky(
        db,
        title,
        description,
        dueDate,
        priority,
        hour,
        minute,
        taskId,
        async (err, results) => {
            if (err) {
                console.error("Error editing task:", err);
                return res.status(500).json({
                    success: false,
                    error: "Internal Server Error",
                });
            }
            console.log("Task succesfully updated");

            res.status(200).json({
                success: true,
                message: "Task updated successfully",
            });
        }
    );
});

app.post("/update-status", async (req, res) => {
    const { status, taskId } = req.body;
    console.log("Received task status update request:", { status, taskId });
    dbOps.updateStatus(db, status, taskId, async (err, results) => {
        if (err) {
            console.error("Error updating task status:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
        console.log("Task status succesfully updated");

        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
        });
    });
});

app.post("/delete-task", async (req, res) => {
    const { taskId } = req.body;
    console.log("Received task deletion request:", { taskId });

    dbOps.deleteTask(db, taskId, async (err, results) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
        console.log("Task succesfully deleted");

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    });
});

app.post("delete-old-tasks", async (req, res) => {
    const { userId } = req.body;

    // Deletes 1 month old comp. tasks and 3 month old tasks in general.
    dbOps.deleteOldTasks(db, userId, async (err, results) => {
        if (err) {
            console.error("Error deleting old tasks:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
        console.log("Old tasks succesfully deleted");
    });
});

app.post("/request-user", async (req, res) => {
    const { userId } = req.body;

    dbOps.requestUser(db, userId, async (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }

        let user = results[0];
        let password = res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: results[0],
        });
    });
});

app.post("/delete-user", async (req, res) => {
    const { userId } = req.body;
    console.log("Received user deletion request:", { userId });

    db.Ops.deleteUser(db, userId, async (err, results) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
        console.log("User succesfully deleted");
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    });
});

app.post("/get-task-progress", async (req, res) => {
    const { userId } = req.body;
    dbOps.getTaskProgress(db, userId, async (err, results) => {
        if (err) {
            console.error("Error fetching task progress:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    });
});

app.post("/get-task-due-soon", async (req, res) => {
    const { userId } = req.body;
    dbOps.getTasksDueSoon(db, userId, async (err, results) => {
        if (err) {
            console.error("Error fetching task progress:", err);
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    });
});

app.post("/reset-password", async (req, res) => {
    const { email, password } = req.body;
    const passwordValidation = validatePassword(password);

    if (!email || !password) {
        console.log("Missing username or password");
        return res.status(400).json({
            success: false,
            error: "Username and password are required",
        });
    }

    if (!passwordValidation.isValid) {
        console.log(passwordValidation.error);
        return res.status(400).json({
            success: false,
            error: passwordValidation.error,
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        dbOps.resetPassword(db, hashed, email, async (err, results) => {
            if (err) {
                console.error("Error resetting password:", err);
                return res.status(500).json({
                    success: false,
                    error: "Internal Server Error",
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Password reset successfully",
            });
        });
    } catch (error) {
        console.error("Error in password reset:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
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
