--Create the database
CREATE DATABASE todo2;

--Use the new database
USE todo2;

--Create the table
CREATE TABLE todolist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status TINYINT DEFAULT 0
);

--Example insert
INSERT INTO todolist (name, status) VALUES
('My first task', 0);

--View your tasks on todolist table
SELECT * FROM todolist;