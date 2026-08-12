# 🦁 Zoo — Web Application CTF

## Overview

**Zoo** is a Web Application Security CTF challenge from **Flag Factory**.

The challenge is designed for **web application penetration testing**. Docker Compose is provided only to make it easy to deploy the vulnerable application and its database locally.

You **do not need to access or exploit the Docker containers** to solve the challenge.

Your interaction with the challenge should primarily be through:

* Web browser
* HTTP/HTTPS requests
* REST/API endpoints
* Cookies and sessions
* Authentication and authorization mechanisms
* Client-side JavaScript
* Normal web application pentesting tools

## Challenge Information

| Item             | Details         |
| ---------------- | --------------- |
| Category         | Web             |
| Challenge        | Zoo             |
| Setup            | Docker Compose  |
| Target           | Web Application |
| Database         | PostgreSQL      |
| Application Port | `8080`          |

## Requirements

You only need:

* Docker
* Docker Compose
* A web browser

For testing, the following tools are recommended but optional:

* Burp Suite
* OWASP ZAP
* `curl`
* `ffuf`
* `nmap`
* Browser Developer Tools

You **do not need to install Go, Node.js, or PostgreSQL locally**.

## Setup

Clone the Flag Factory repository:

```bash
git clone https://github.com/rajv4rdhan/Flag-Factory.git
```

Navigate to the challenge:

```bash
cd Flag-Factory/web/zoo
```

Build and start the application:

```bash
docker compose up --build -d
```

Check that the services are running:

```bash
docker compose ps
```

Once the application has started, open:

```text
http://localhost:8080
```

That's it — the challenge is ready for web application testing.

## Important

The Docker containers are **only used to run the challenge environment**.

You do **not** need to:

* Execute commands inside the application container
* Access the container filesystem
* Exploit Docker
* Exploit the PostgreSQL container directly
* Modify the application source code
* Interact with PostgreSQL manually

The intended attack surface is the **web application itself**.

## Recommended Testing Workflow

### 1. Explore the Application

Start by browsing the application normally.

Look for:

* Registration
* Login
* Logout
* User profiles
* Administrative functionality
* Forms
* Search functionality
* File-related functionality
* API requests
* Hidden functionality
* Error messages

Don't immediately jump into automated scanning. Understanding the application's functionality first can reveal useful attack surfaces.

### 2. Inspect HTTP Traffic

Use browser Developer Tools or a proxy such as Burp Suite.

Pay attention to:

```text
GET /...
POST /...
PUT /...
DELETE /...
```

Inspect:

* Request parameters
* JSON bodies
* Cookies
* Authorization headers
* JWTs/tokens
* HTTP response headers
* Status codes
* Redirects
* Error responses

### 3. Enumerate Endpoints

Identify the application's API endpoints and routes.

Useful approaches include:

```bash
ffuf -u http://localhost:8080/FUZZ \
     -w /path/to/wordlist.txt
```

You can also inspect the frontend JavaScript and browser network requests to discover API functionality.

### 4. Test Authentication

Investigate how authentication is implemented.

Things worth checking include:

* Login logic
* Registration logic
* Session management
* Password handling
* JWT implementation
* Token expiration
* Token validation
* Authentication bypasses
* Account enumeration

### 5. Test Authorization

After obtaining a normal user account, investigate whether functionality is properly protected.

Try accessing resources belonging to another user and look for:

* IDOR
* Broken access control
* Privilege escalation
* Missing authorization checks
* Horizontal privilege escalation
* Vertical privilege escalation

For example, if the application makes requests such as:

```http
GET /api/users/123
```

test whether changing the identifier produces access to another user's data:

```http
GET /api/users/124
```

### 6. Test Input Handling

Identify all user-controlled inputs and test how the application handles them.

Depending on the functionality you discover, investigate:

* SQL injection
* NoSQL injection
* Command injection
* Server-side template injection
* Cross-site scripting
* Path traversal
* File inclusion
* SSRF
* Deserialization issues
* Business logic vulnerabilities

Only test vulnerabilities that are relevant to the application's actual attack surface.

### 7. Inspect Client-Side Code

The frontend can provide valuable information about the backend API.

Use browser Developer Tools or download the JavaScript bundles and search for:

```text
/api/
admin
user
token
auth
secret
flag
debug
```

Look for:

* Hidden routes
* API endpoints
* Feature flags
* Client-side authorization
* Hardcoded secrets
* Debug functionality
* References to backend functionality

Remember that client-side restrictions are not security boundaries.

### 8. Analyze API Responses

Don't only look at successful responses.

Test how the application behaves with:

* Missing parameters
* Extra parameters
* Invalid types
* Unexpected JSON values
* Invalid IDs
* Missing authentication
* Invalid authentication
* Expired tokens
* Different HTTP methods

Error messages can sometimes reveal useful information about the backend implementation.

## Useful Commands

### Start

```bash
docker compose up --build -d
```

### Stop

```bash
docker compose down
```

### Restart

```bash
docker compose restart
```

### Check status

```bash
docker compose ps
```

### View application logs

```bash
docker compose logs -f zoo-app
```

These commands are intended for **managing the challenge environment**, not as part of the exploitation process.

## Reset the Challenge

If you want to return the environment to a clean state:

```bash
docker compose down -v
docker compose up --build -d
```

> **Warning:** `docker compose down -v` removes the PostgreSQL volume and resets persistent application data.

## Target

After starting the challenge, the primary target is:

```text
http://localhost:8080
```

Treat this as a normal web application penetration-testing target.

For example:

```text
Browser
   │
   ▼
http://localhost:8080
   │
   ├── Web UI
   ├── Authentication
   ├── API endpoints
   ├── User functionality
   └── Backend logic
```

The database and Docker infrastructure exist to support the application and are **not the intended attack surface**.

## Rules

* Test only the locally deployed CTF instance.
* Do not attack external systems.
* Do not modify the challenge source code.
* Do not rely on direct container access as part of the intended solution.
* Do not use the host machine or Docker environment to bypass the application's intended security controls.
* The goal is to identify and exploit vulnerabilities through the web application's exposed attack surface.

## Quick Start

```bash
git clone https://github.com/rajv4rdhan/Flag-Factory.git
cd Flag-Factory/web/zoo
docker compose up --build -d
```

Open:

```text
http://localhost:8080
```

Start testing with your preferred web application security tools.

**Happy Hunting! 🏴‍☠️**
