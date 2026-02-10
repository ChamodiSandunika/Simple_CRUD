# Book Management System - CRUD Application

A full-stack CRUD application built with Spring Boot (backend), Next.js (frontend), and PostgreSQL (database).

## 🚀 Features

- ✅ Create new books
- ✅ Read/View all books
- ✅ Update existing books
- ✅ Delete books
- ✅ Clean and responsive UI
- ✅ RESTful API
- ✅ PostgreSQL database integration

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** or higher
- **Node.js 18** or higher
- **PostgreSQL 12** or higher
- **Maven** (usually comes with Java)

## 🗄️ PostgreSQL Setup

### Step 1: Install PostgreSQL

#### Windows:
1. Download PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the installation wizard
3. Set a password for the `postgres` user during installation (remember this password!)
4. Default port: 5432

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

Open PostgreSQL command line or pgAdmin and run:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE bookdb;

-- Verify database creation
\l

-- Exit
\q
```

**Or using pgAdmin:**
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Name it "bookdb"
5. Click "Save"

### Step 3: Configure Database Connection

The application is already configured with default settings in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bookdb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**⚠️ Update these values if your PostgreSQL setup is different:**
- Change `postgres` username if you use a different user
- Change `postgres` password to your actual PostgreSQL password
- Change `localhost:5432` if PostgreSQL runs on a different host/port

### Step 4: Verify Connection

You can test the connection using psql:

```bash
psql -U postgres -d bookdb -h localhost -p 5432
```

If successful, you'll see the PostgreSQL prompt.

## 🏃 Running the Application

### Backend (Spring Boot)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run the application:

**On Windows:**
```bash
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

**On macOS/Linux:**
```bash
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on **http://localhost:8080**

**Note:** The first time you run the application, Hibernate will automatically create the `books` table in your PostgreSQL database.

### Frontend (Next.js)

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

## 🔌 API Endpoints

The backend provides the following RESTful API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/{id}` | Get book by ID |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |
| GET | `/api/books/search/title?query={title}` | Search by title |
| GET | `/api/books/search/author?query={author}` | Search by author |

### Example API Requests

**Create a Book:**
```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "description": "A classic American novel",
    "price": 15.99
  }'
```

**Get All Books:**
```bash
curl http://localhost:8080/api/books
```

**Update a Book:**
```bash
curl -X PUT http://localhost:8080/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Updated",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "description": "An updated description",
    "price": 19.99
  }'
```

**Delete a Book:**
```bash
curl -X DELETE http://localhost:8080/api/books/1
```

## 🗂️ Database Schema

The application uses the following table structure:

```sql
CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DOUBLE PRECISION NOT NULL
);
```

This table is automatically created by Hibernate when you first run the application.

## 📁 Project Structure

```
Simple_CRUD/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/bookapplication/
│   │       │   ├── BookapplicationApplication.java
│   │       │   ├── config/
│   │       │   │   └── CorsConfig.java
│   │       │   ├── controller/
│   │       │   │   └── BookController.java
│   │       │   ├── entity/
│   │       │   │   └── Book.java
│   │       │   ├── repository/
│   │       │   │   └── BookRepository.java
│   │       │   └── service/
│   │       │       └── BookService.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
└── frontend/
    ├── app/
    │   ├── page.tsx (Main CRUD UI)
    │   └── layout.tsx
    └── package.json
```

## 🛠️ Technologies Used

### Backend:
- **Spring Boot 4.0.2** - Java framework
- **Spring Data JPA** - ORM for database operations
- **PostgreSQL** - Database
- **Lombok** - Reduces boilerplate code
- **Maven** - Build tool

### Frontend:
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 🔧 Troubleshooting

### Backend Issues:

1. **Connection refused to PostgreSQL:**
   - Ensure PostgreSQL is running: `sudo systemctl status postgresql` (Linux) or check Services (Windows)
   - Verify the port: default is 5432
   - Check firewall settings

2. **Authentication failed:**
   - Double-check username and password in `application.properties`
   - Ensure the PostgreSQL user has proper permissions

3. **Database doesn't exist:**
   - Create the database manually: `CREATE DATABASE bookdb;`

4. **Port 8080 already in use:**
   - Change the port in `application.properties`: `server.port=8081`

### Frontend Issues:

1. **Cannot connect to backend:**
   - Ensure backend is running on port 8080
   - Check CORS configuration in `CorsConfig.java`

2. **Module not found:**
   - Run `npm install` in the frontend directory

## 📝 Testing the Application

1. Start PostgreSQL
2. Start the backend (port 8080)
3. Start the frontend (port 3000)
4. Open browser and go to http://localhost:3000
5. Click "Add New Book" to create your first book
6. Try creating, editing, and deleting books

## 🎯 Next Steps

You can enhance this application by adding:
- User authentication
- Book categories
- Image uploads
- Search and filtering
- Pagination
- Advanced validation
- Unit and integration tests

## 📄 License

This project is open source and available for educational purposes.
