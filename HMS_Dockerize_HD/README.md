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
- Dockerised end-to-end application deployment

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
- Docker
- Docker Compose

## Docker Setup steps

This project can be run end-to-end using Docker Compose. The Docker setup starts the following services:

- `app`: Node.js/Express Hospital Management System
- `mongodb`: MongoDB database used by the app and session store
- `seed`: one-off service used to insert demo users into MongoDB


### Prerequisites

Install Docker Desktop and make sure it is running.


### Runtime configuration

The application uses environment variables for runtime configuration. For security, the real .env file is not committed to GitHub.
Before starting the application, create a .env file in the project root.
The .env file should contain:

```
PORT= (put a port )
MONGO_URI= (replace mongo with your own)
SESSION_SECRET=(put any long text)
COOKIE_SECURE=(put it in false)
NODE_ENV=development
```


### Build and start the application

From the project folder:

```
docker compose up --build -d
```
Check that the containers are running:
```
docker ps
```
Expected Container
```
hms-app
hms-mongodb
```

The application will be available at:

```
http://localhost:3000
```

The login page is available at:

```
http://localhost:3000/login
```

### Seed demo users

After the containers are running, seed the database:

```
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
