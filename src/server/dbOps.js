export function setupDatabase(db) {
    const createDB = `CREATE DATABASE IF NOT EXISTS mandarina;`;
    const useDB = `USE mandarina;`;
    const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            theme VARCHAR(10) NOT NULL DEFAULT 'light'
        );`;
    const taskTable = ` 
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            description TEXT,
            dueDate TIMESTAMP,  -- Changed from DATE to TIMESTAMP
            priority ENUM('Low', 'Medium', 'High'),
            status ENUM('Pending', 'In Progress', 'Completed'),
            completionDate DATE,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`;
    const setupQueries = `${createDB} ${useDB} ${usersTable} ${taskTable}`;

    db.query(setupQueries, (err) => {
        if (err) throw err;
        console.log("Database and table setup complete.");
    });
}

export function getUserByEmail(db, email, callback) {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], callback);
}

export function checkEmail(db, email, callback) {
    const query = `SELECT 1 FROM users WHERE email =?`;
    db.query(query, [email], callback);
}

export function addUser(db, email, password, callback) {
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.query(query, [email, password], callback);
}

export function createTask(
    db,
    title,
    description,
    dueDate,
    priority,
    status,
    user_id,
    callback
) {
    // Combine the dueDate and time into a TIMESTAMP
    const query = `INSERT INTO tasks 
    (title, description, dueDate, priority, status, user_id) 
    VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(
        query,
        [title, description, dueDate, priority, status, user_id],
        callback
    );
}

export function getTasksByUserID(db, user_id, callback) {
    const query = `SELECT * FROM tasks WHERE user_id = ?`;
    db.query(query, [user_id], callback);
}

export function getTask(db, taskId, callback) {
    const query = `SELECT * FROM tasks WHERE id = ?`;
    db.query(query, [taskId], callback);
}

export function updateTask(
    db,
    title,
    description,
    dueDate,
    priority,
    status,
    taskId,
    callback
) {
    const query = `UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, status = ? WHERE id = ?`;
    db.query(
        query,
        [title, description, dueDate, priority, status, taskId],
        callback
    );
}

export function updateStatus(db, status, taskId, callback) {
    // Get the current date in UTC
    const today = new Date();

    // Format current date as 'YYYY-MM-DD HH:MM:SS'
    const formattedDate = today
        .toISOString() // Convert to UTC ISO string
        .slice(0, 19) // Slice off milliseconds and timezone
        .replace("T", " ");
    let query = ``;
    if (status == "Completed") {
        query = `UPDATE tasks SET status =?, completionDate=? WHERE id =?`;
        db.query(query, [status, formattedDate, taskId], callback);
    } else {
        query = `UPDATE tasks SET status =? WHERE id =?`;
        db.query(query, [status, taskId], callback);
    }
}

export function deleteTask(db, taskId, callback) {
    const query = `DELETE FROM tasks WHERE id =?`;
    db.query(query, [taskId], callback);
}

export function deleteOldTasks(db, user_id, callback) {
    const query = `DELETE FROM tasks WHERE user_id = ? 
        AND ((status = 'Completed' AND dueDate < DATE_SUB(NOW(), INTERVAL 1 MONTH)) 
        OR dueDate < DATE_SUB(NOW(), INTERVAL 3 MONTH));`;
    db.query(query, [user_id], callback);
}

export function requestUser(db, user_id, callback) {
    const query = `SELECT * FROM users WHERE id =?`;
    db.query(query, [user_id], callback);
}

export function deleteUser(db, user_id, callback) {
    const query = `DELETE FROM users WHERE id =?`;
    db.query(query, [user_id], callback);
}

export function getTasksProgress(db, user_id, callback) {
    const query = `SELECT COUNT(id) FROM tasks WHERE user_id =? GROUP BY status`;
    db.query(query, [user_id], callback);
}

export function getTasksDueSoon(db, user_id, callback) {
    const query = `SELECT title, dueDate, status, priority
    FROM tasks 
    WHERE user_id =? 
    AND dueDate >= CURDATE() 
    AND dueDate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    AND status != 'Completed'
    ORDER BY dueDate ASC`;
    db.query(query, [user_id], callback);
}

export function resetPassword(db, password, email, callback) {
    const query = `UPDATE users SET password =? WHERE email =?`;
    db.query(query, [password, email], callback);
}
