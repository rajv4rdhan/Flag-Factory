# CTF File Traversal Challenge

## Overview
This CTF challenge implements a controlled file traversal vulnerability in the Zoo Management System.

## Vulnerability Details

### Endpoints
- `GET /files` - Lists available files (requires authentication)
- `GET /download?file=<filename>` - Downloads files (requires authentication)

### How it Works
1. **Authentication Required**: Players must first create an account and log in to access the file endpoints
2. **Basic File Access**: The `/files` endpoint shows legitimate files in the `user_data` directory
3. **Path Traversal**: The `/download` endpoint has a flawed security check that can be bypassed

### Security Flaw
The vulnerable code in `internal/handlers/file.go`:
```go
// Basic "security" check that can be bypassed
if strings.Contains(filename, "..") {
    // Check if it's a "legitimate" traversal (hint for CTF players)
    if !strings.Contains(filename, "user_data") && !strings.Contains(filename, "scripts") {
        c.JSON(http.StatusForbidden, gin.H{"error": "Directory traversal detected"})
        return
    }
}
```

### Exploitation
Players can bypass the protection by including "user_data" or "scripts" in their path traversal attempts:

1. **Basic Access**: `?file=readme.txt` - Works normally
2. **Simple Traversal**: `?file=../something` - Blocked
3. **Bypass Method**: `?file=../scripts/backup.sh` - Allowed because it contains "scripts"
4. **Flag Location**: `?file=../.env` - Can be accessed with the right approach

### Available Flags
- **Flag 1**: In `ctf_files/.env` - `CTF{tr4v3rs4l_1s_d4ng3r0us_4lw4ys}`
- **Flag 2**: In `ctf_files/scripts/backup.sh` - `CTF{f1l3_tr4v3rs4l_ch4mp10n}`

### Solution Path
1. Register/Login to get authentication
2. Visit `/files` to see available files
3. Try `/download?file=readme.txt` to understand the functionality
4. Attempt path traversal with `/download?file=../something` to see the error
5. Notice the error message or code to understand the bypass condition
6. Use `/download?file=../scripts/backup.sh` to get the first flag
7. Use `/download?file=../user_data/../.env` or similar to get the second flag

## Safety Features
- **Limited Scope**: Only files in the `ctf_files` directory are accessible
- **No Source Code Exposure**: Your actual application code is not in the traversable path
- **Controlled Environment**: The vulnerability is contained to specific directories
- **Authentication Required**: Adds a realistic barrier to access

## Files Created
```
ctf_files/
├── .env (contains flag)
├── scripts/
│   └── backup.sh (contains flag)
└── user_data/
    ├── readme.txt
    ├── uploaded_files.txt
    └── animal_report_2024.pdf
```

## Testing the Challenge
1. Start the server: `go run .\cmd\server\main.go`
2. Create an account via POST `/signup`
3. Login via POST `/login`
4. Access `/files` to see available files
5. Try exploiting `/download?file=...` with various payloads

This creates a realistic but controlled CTF challenge that teaches file traversal concepts without exposing your actual codebase.
