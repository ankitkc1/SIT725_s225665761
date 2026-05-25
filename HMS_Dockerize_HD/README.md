# Hospital Management System (HMS)

- Secure login with session-based authentication
- Role-based access control for:
  - Admin
  - Reception
  - Doctor
  - Nurse
  - Patient
- Dashboard with role-specific summary
- Patient registration and patient list
- Appointment booking and appointment status updates
- Clinical record notes for doctors and nurses
- Staff management for administrators
- Patient portal for own profile, appointments, and records
- MVC project structure

## Architecture Diagram
<img width="1518" height="703" alt="HMS – Architecture Diagram" src="https://github.com/user-attachments/assets/e63849ab-6e66-4617-b90a-cb1de07abf19" />



## Technologies used

- Node.js
- Express.js
- HTML
- Materialize CSS
- MongoDB Atlas
- Mongoose
- express-session
- connect-mongo
- bcryptjs

## Setup steps

This project can be run end-to-end using Docker Compose. The Docker setup starts two services:

- `app`: Node.js/Express Hospital Management System
- `mongodb`: MongoDB database used by the app and session store

A one-off `seed` service is also provided to insert demo users into MongoDB.

### Prerequisites

Install Docker Desktop and make sure it is running.

### Build and start the application

From the project folder:

```bash
docker compose up --build -d
```

The application will be available at:

```text
http://localhost:3000
```

The login page is available at:

```text
http://localhost:3000/login
```

### Seed demo users

After the containers are running, seed the database:

```bash
docker compose --profile seed run --rm seed
```

All demo users use this password:

```text
password123
```

| Role | Email |
|---|---|
| Admin | admin@hms.com |
| Reception | reception@hms.com |
| Doctor | doctor@hms.com |
| Nurse | nurse@hms.com |
| Patient | patient@hms.com |

### Student identity endpoint

The HD task requires a student identity REST API endpoint. Open:

```text
http://localhost:3000/api/student
```

Expected response:

```json
{
  "name": "Ankit K C",
  "studentId": "s225665761"
}
```

### Health check endpoint

```text
http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "Hospital Management System"
}
```

### Stop the application

```bash
docker compose down
```

### Reset the database completely

Use this only when a fresh test database is needed:

```bash
docker compose down -v
docker compose up --build -d
docker compose --profile seed run --rm seed
```

### Runtime configuration and sensitive information

The application reads runtime configuration from environment variables in `docker-compose.yml`:

- `PORT`: Express server port inside the container
- `MONGO_URI`: MongoDB connection string
- `SESSION_SECRET`: secret used by Express session
- `COOKIE_SECURE`: set to `false` for localhost HTTP testing


### Evidence checked before submission

Before submitting, the following was tested in a fresh Docker environment:

1. `docker compose up --build -d` starts the Node.js app and MongoDB.
2. `http://localhost:3000/login` loads successfully.
3. `http://localhost:3000/api/student` returns the required name and student ID JSON.
4. `docker compose --profile seed run --rm seed` creates demo users.
5. Login works using `admin@hms.com` and `password123`.
6. Role-based dashboard pages load after login.
7. Database-backed features such as users/sessions/patient-related routes connect to MongoDB successfully.

## Core models

### User
Stores login and role information.

### Patient
Stores demographic and non-clinical information, assigned doctor, and linked patient account.

### Appointment
Stores booking date, doctor, patient, reason, and status.

### ClinicalRecord
Stores diagnosis, treatment notes, observations, and prescriptions.

## Security features already included

- Password hashing using bcryptjs
- Session-based authentication
- Role-based page access
- Basic separation of clinical and non-clinical access
