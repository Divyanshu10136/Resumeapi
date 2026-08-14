# ResumeFlow Backend

Node.js + Express + Sequelize + MySQL backend.

## Requirements
- Node.js 18+ (20 LTS recommended)
- MySQL 8+
- VS Code

## 1. Install packages
Open this folder in VS Code Terminal:

```bash
npm install
```

## 2. Create the database
Open MySQL Workbench or MySQL command line and run:

```sql
CREATE DATABASE resumeflow;
```

Do not create tables manually. Sequelize creates them when the server starts.

## 3. Configure MySQL
Copy `.env.example` to `.env` and edit:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=resumeflow
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
JWT_SECRET=your-secret-key
```

If your MySQL root account has no password, leave `DB_PASSWORD=` empty.

## 4. Start the backend

Development:
```bash
npm run dev
```

Normal:
```bash
npm start
```

You should see:
- MySQL connected successfully.
- Database tables are ready.
- ResumeFlow API running at http://localhost:3000

## 5. Test
Open:
- http://localhost:3000
- http://localhost:3000/api/health

Register:
`POST http://localhost:3000/api/auth/register`

JSON:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

Login:
`POST http://localhost:3000/api/auth/login`

## Common VS Code problems

### `npm is not recognized`
Install Node.js and restart VS Code.

### `ECONNREFUSED 127.0.0.1:3306`
MySQL is not running, or the MySQL port is different.

### `Access denied for user 'root'`
Your MySQL username/password in `.env` is incorrect.

### `Unknown database 'resumeflow'`
Run:
`CREATE DATABASE resumeflow;`

### Port 3000 already in use
Change `PORT=3001` in `.env`.
