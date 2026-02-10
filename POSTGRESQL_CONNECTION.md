# PostgreSQL Connection Guide

## Quick Setup for Book Management System

### 1. Install PostgreSQL

Download and install from: https://www.postgresql.org/download/

**Default credentials during installation:**
- Username: `postgres`
- Password: (set your own)
- Port: `5432`

### 2. Create Database

**Option A - Using Command Line:**
```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE bookdb;

# Exit
\q
```

**Option B - Using pgAdmin (GUI):**
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to PostgreSQL server (enter your password)
3. Right-click "Databases" → Create → Database
4. Database name: `bookdb`
5. Click Save

### 3. Configure Spring Boot Connection

File: `backend/src/main/resources/application.properties`

```properties
# Database URL - Format: jdbc:postgresql://host:port/database_name
spring.datasource.url=jdbc:postgresql://localhost:5432/bookdb

# Your PostgreSQL username (default: postgres)
spring.datasource.username=postgres

# Your PostgreSQL password (set during installation)
spring.datasource.password=YOUR_PASSWORD_HERE

# PostgreSQL driver (already included in pom.xml)
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate will automatically create/update tables
spring.jpa.hibernate.ddl-auto=update

# Show SQL queries in console (for debugging)
spring.jpa.show-sql=true

# PostgreSQL dialect
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### 4. Important Configuration Settings

**Update these values in application.properties:**

| Setting | Default | Change if... |
|---------|---------|--------------|
| `localhost` | localhost | PostgreSQL is on another machine |
| `5432` | 5432 | You changed the PostgreSQL port |
| `postgres` | postgres | You use a different username |
| `postgres` | postgres | **YOU MUST change this to your actual password** |
| `bookdb` | bookdb | You named your database differently |

### 5. Test Database Connection

**Method 1 - Using psql:**
```bash
psql -U postgres -d bookdb -h localhost -p 5432
# Enter your password when prompted
# If successful, you'll see: bookdb=#
```

**Method 2 - Using Spring Boot:**
Just run the backend application. If the connection is successful, you'll see:
```
HikariPool-1 - Start completed.
```

If there's an error, you'll see:
```
Connection refused
or
Authentication failed
```

### 6. Common Connection Issues

#### Issue: "Connection refused"
**Solutions:**
- Ensure PostgreSQL is running:
  - Windows: Check Services → postgresql-x64-XX (should be "Running")
  - Mac: `brew services list` → postgresql (should be "started")
  - Linux: `sudo systemctl status postgresql`
- Check if port 5432 is open
- Verify firewall settings

#### Issue: "Authentication failed"
**Solutions:**
- Double-check password in `application.properties`
- Ensure the user exists: `psql -U postgres -c "SELECT usename FROM pg_user;"`
- Reset password if needed:
  ```sql
  ALTER USER postgres PASSWORD 'new_password';
  ```

#### Issue: "Database does not exist"
**Solutions:**
- Create the database: `CREATE DATABASE bookdb;`
- Check existing databases: `psql -U postgres -c "\l"`

#### Issue: "Could not find driver"
**Solutions:**
- Verify PostgreSQL dependency in `pom.xml`:
  ```xml
  <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
  </dependency>
  ```
- Run: `mvnw clean install`

### 7. Verify Database Tables

After running the backend for the first time, verify the table was created:

```bash
# Connect to database
psql -U postgres -d bookdb

# List all tables
\dt

# You should see: books table

# View table structure
\d books

# View all data
SELECT * FROM books;

# Exit
\q
```

### 8. Connection String Formats

**Local Connection:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bookdb
```

**Remote Connection:**
```properties
spring.datasource.url=jdbc:postgresql://192.168.1.100:5432/bookdb
```

**Cloud Connection (e.g., Heroku):**
```properties
spring.datasource.url=jdbc:postgresql://ec2-xx-xx-xx-xx.compute.amazonaws.com:5432/database_name?sslmode=require
```

### 9. Security Best Practices

**For Production:**

1. **Use Environment Variables:**
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

2. **Never commit passwords to Git:**
   - Add `application.properties` to `.gitignore`
   - Use `application-dev.properties` for local development
   - Use environment variables in production

3. **Create a separate database user:**
```sql
CREATE USER bookapp_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE bookdb TO bookapp_user;
```

### 10. Data Persistence

Your data is stored in PostgreSQL at:
- **Windows:** `C:\Program Files\PostgreSQL\XX\data`
- **Mac:** `/usr/local/var/postgres`
- **Linux:** `/var/lib/postgresql/XX/main`

**Back up your database:**
```bash
pg_dump -U postgres bookdb > backup.sql
```

**Restore database:**
```bash
psql -U postgres bookdb < backup.sql
```

---

## Quick Start Checklist

- [ ] PostgreSQL installed
- [ ] PostgreSQL service running
- [ ] Database "bookdb" created
- [ ] Username in application.properties matches PostgreSQL user
- [ ] Password in application.properties is correct
- [ ] Port 5432 is accessible
- [ ] Backend starts without connection errors
- [ ] Table "books" auto-created after first backend run

## Need Help?

Check the main [README.md](README.md) for complete setup instructions and troubleshooting.
