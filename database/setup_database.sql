-- ================================================
-- Book Management System - Database Setup Script
-- ================================================

-- Step 1: Create database (run as postgres user)
CREATE DATABASE bookdb;

-- Step 2: Connect to the database
\c bookdb

-- Step 3: Create a dedicated user (optional but recommended)
CREATE USER bookapp_user WITH PASSWORD 'bookapp123';

-- Step 4: Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE bookdb TO bookapp_user;

-- Step 5: Create the books table (or let Hibernate auto-create it)
-- Note: This is optional - Spring Boot will automatically create this table
-- when you run the backend application for the first time.

CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);

-- Step 7: Insert sample data (optional)
INSERT INTO books (title, author, isbn, description, price) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'A classic American novel set in the Jazz Age', 15.99),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'A gripping tale of racial injustice and childhood innocence', 14.99),
('1984', 'George Orwell', '978-0-452-28423-4', 'A dystopian social science fiction novel', 13.99),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 'A romantic novel of manners', 12.99),
('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0', 'A story about teenage rebellion and alienation', 16.99);

-- Step 8: Verify data
SELECT * FROM books;

-- Step 9: Check table structure
\d books

-- ================================================
-- Usage Instructions
-- ================================================
-- 
-- To run this script:
-- 
-- 1. Open PostgreSQL command line or terminal
--    psql -U postgres
-- 
-- 2. Run this script:
--    \i setup_database.sql
-- 
-- Or copy and paste the commands one by one
-- 
-- ================================================
-- Configuration for Spring Boot
-- ================================================
-- 
-- After running this script, update application.properties:
-- 
-- Using postgres user (default):
--   spring.datasource.username=postgres
--   spring.datasource.password=your_postgres_password
-- 
-- Using dedicated user (recommended):
--   spring.datasource.username=bookapp_user
--   spring.datasource.password=bookapp123
-- 
-- ================================================

-- Clean up (if you need to start fresh)
-- WARNING: This will delete all data!
-- DROP TABLE IF EXISTS books;
-- DROP DATABASE IF EXISTS bookdb;
-- DROP USER IF EXISTS bookapp_user;
