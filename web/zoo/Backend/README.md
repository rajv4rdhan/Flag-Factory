# Zoo Backend

A Go web application with PostgreSQL database support, featuring user authentication and database migration system.

## Prerequisites

- Go 1.23+ installed
- PostgreSQL running on localhost:5432
- Git (optional)

## Quick Setup

### Option 1: Using PowerShell Script (Windows)

```powershell
cd scripts
.\setup.ps1
```

### Option 2: Using Bash Script (Linux/Mac)

```bash
cd scripts
chmod +x setup.sh
./setup.sh
```

### Option 3: Using Database Initialization Tool

```bash
cd scripts
go run init-db.go
```

### Option 4: Using Migration Tool

```bash
cd scripts
go run migrate.go reset
```

## Manual Setup

1. **Clone or navigate to the project:**
   ```bash
   cd g:\Projects\flag-factory\web\zoo\Backend
   ```

2. **Install dependencies:**
   ```bash
   go mod tidy
   ```

3. **Create PostgreSQL database:**
   ```sql
   createdb -h localhost -U postgres ctfdb
   ```

4. **Initialize database:**

   ```bash
   cd scripts
   go run init-db.go
   ```

5. **Start the server:**

   ```bash
   go run cmd/server/main.go
   ```

## Project Structure

```
Backend/
├── cmd/
│   └── server/
│       └── main.go           # Application entry point
├── internal/
│   ├── handlers/
│   │   └── auth.go          # Authentication handlers
│   ├── orm/
│   │   └── orm.go           # Database connection and utilities
│   ├── storage/
│   │   └── user.go          # User data access layer
│   └── utils/
│       └── jwt.go           # JWT token utilities
├── migrations/
│   ├── 001_create_users_table.sql
│   └── 002_seed_data.sql
├── scripts/
│   ├── migrate.go           # Database migration tool
│   ├── setup.sh             # Unix setup script
│   └── setup.ps1            # PowerShell setup script
├── go.mod
└── README.md
```

## API Endpoints

- `POST /signup` - User registration
- `POST /login` - User authentication  
- `GET /home` - Home page (protected)

## Sample Users

After initialization, these users are available:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| user1 | password123 | user |
| user2 | password456 | user |
| moderator | mod123 | moderator |
| testuser | test123 | user |

## Database Commands

### Run all migrations:
```bash
cd scripts
go run migrate.go up
```

### Reset database (drop and recreate):
```bash
cd scripts
go run migrate.go reset
```

### Drop all tables:
```bash
cd scripts
go run migrate.go down
```

## Configuration

Database connection settings in `cmd/server/main.go`:
- Host: localhost
- Port: 5432
- Database: ctfdb
- User: postgres
- Password: password

## Development

1. Make changes to the code
2. Test with: `go build ./cmd/server`
3. Run with: `go run cmd/server/main.go`

## Troubleshooting

1. **PostgreSQL not running:**
   - Start PostgreSQL service
   - Verify with: `pg_isready -h localhost -p 5432`

2. **Database connection errors:**
   - Check PostgreSQL credentials
   - Ensure database `ctfdb` exists

3. **Build errors:**
   - Run: `go mod tidy`
   - Check Go version: `go version`
