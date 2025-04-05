# Heart Rate Analytics Application

## Overview

This project provides a service that allows you to track and analyze heart rate data for patients. It provides the following features:
- Track high heart rate events for each patient.
- Calculate average, maximum, and minimum heart rate values for a specific patient within a given time range.
- Provide heart rate analytics (average, maximum, minimum) for all patients over a time range.
- Count and track the number of requests made by a patient.

The application is built using **NestJS**, **TypeORM**, **PostgreSQL**, and **Redis**. Docker is used for containerization to simplify deployment.

---

## Features

- **Heart Rate Analytics**:
  - Calculate **average**, **maximum**, and **minimum** heart rate for a patient over a specified time range.
  - Get **high heart rate events** (greater than 100 bpm) for a specific patient.
  - Provide **analytics** for all patients in a given time period.
  
- **Redis Integration**:
  - **Track patient request counts** using Redis.

---

## Prerequisites

Before installing the application, ensure you have the following tools installed:

- **Docker**: To run the application in a containerized environment.
- **Node.js**: For local development.
- **PostgreSQL**: Database for storing heart rate data.
- **Redis**: Caching and request counting.

---

## Installation

### Option 1: Using Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/avigibridev/Eitan.git
   cd Eitan
   ```

2. **Build and run the application with Docker Compose**:
   Make sure you have **Docker** and **Docker Compose** installed.
   ```bash
   docker-compose up --build
   ```
   *** 
   seed mock data :
   ```
   docker exec -it heart_rate_service npx ts-node src/seeds/seed.ts
   ```

3. **Access the application**:
   - The app will be available at `http://localhost:3000`.
   - PostgreSQL will be available at port `5432` and Redis will be running on port `6379`.

4. **Stopping the application**:
   To stop the Docker containers, run:
   ```bash
   docker-compose down
   ```

5. **Accessing logs**:
   You can check the logs of the application using:
   ```bash
   docker logs heart_rate_service
   ```

---

### Option 2: Local Setup (Without Docker)

#### Step 1: Clone the repository
```bash
 git clone https://github.com/avigibridev/Eitan.git
 cd Eitan
```

#### Step 2: Install Dependencies
Install the required Node.js packages:
```bash
npm install
```

#### Step 3: Install PostgreSQL

1. **Install PostgreSQL** (Follow the instructions based on your operating system):
   - [PostgreSQL Downloads](https://www.postgresql.org/download/)

2. **Create the database**:
   After installing PostgreSQL, create the required database:
   ```bash
   psql -U myuser
   CREATE DATABASE mydatabase;
   CREATE USER myuser WITH PASSWORD 'mypassword';
   GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
3. **Set up the database connection** in `.env` (or `config` files):
   - `DB_HOST=localhost`
   - `DB_PORT=5432`
   - `DB_USER=myuser`
   - `DB_PASSWORD=mypassword`
   - `DB_NAME=mydatabase`

#### Step 4: Install Redis

1. **Install Redis** (Follow the instructions based on your operating system):
   - [Redis Downloads](https://redis.io/download)

2. **Start Redis**:
   Run Redis using the following command (default port is `6379`):
   ```bash
   redis-server
   ```

3. **Set up Redis connection** in `.env` (or `config` files):
   - `REDIS_HOST=localhost`
   - `REDIS_PORT=6379`

#### Step 5: Run the Application Locally

After setting up PostgreSQL and Redis:

1. **Run the application**:
   ```bash
   npm run start:dev
   ```   
2. **Seed mock data**:
   ```bash
   npx ts-node src/seeds/seed.ts
   ```   
3. **Access the application**:
   - The application will be available at `http://localhost:3000`.

---

## Endpoints

#### Tests: download and import Heart rate Service API Postman file

### **Heart Rate Analytics for a Specific Patient**
```http
GET /heart-rate/:patientId/analytics?start={start_date}&end={end_date}
```
- **Params**: `patientId` - ID of the patient
- **Query**: `start`, `end` - The start and end dates for the analytics range
- **Returns**: Heart rate analytics (average, max, min) for the specified patient in the given date range.

### **High Heart Rate Events for a Specific Patient**
```http
GET /heart-rate/:patientId/high-heart-rate-events
```
- **Params**: `patientId` - ID of the patient
- **Returns**: List of high heart rate events (heart rate > 100) for the specified patient.

### **Analytics for All Patients**(Not clear per patient means)
```http
GET /heart-rate/analytics?start={start_date}&end={end_date}
```
- **Query**: `start`, `end` - The start and end dates for the analytics range
- **Returns**: Heart rate analytics (average, max, min) for all patients in the given date range.

### **Request Count for a Specific Patient**
```http
GET /heart-rate/:patientId/request-count
```
- **Params**: `patientId` - ID of the patient
- **Returns**: The number of requests made by the specified patient.

---

## Imporvments
### Testing
- Add e2e tests using Jest + @nestjs/testing

- Add integration tests for Redis + PostgreSQL behavior

- Mock Redis for unit testing HeartRateService

 ### Logic
- Batch Redis calls using pipeline() if you expect multiple Redis queries in a row

- cache frequent analytics results in Redis (average, max, etc.) with TTL

- Debounce or throttle the trackPatientRequest calls if hit too frequently

### Infrastructure
- Implement rate-limiting (e.g. @nestjs/throttler)

- Use PM2 or node --cluster to run multi-core in Docker

- Enable health checks and monitoring (e.g. /health, Prometheus)

- Add connection retry logic (especially for Redis and DB)

### Optimizations
- Consider partitioning readings by time if the table grows fast

- Archive old data to reduce DB load

### Security

- Add JWT Auth (@nestjs/jwt) for secured routes

- Use Guards (@UseGuards(AuthGuard)) to protect controllers like /heart-rate

- Use role-based access control (RBAC) if you have admins, doctors, etc.

- Log suspicious request spikes per patient

## Troubleshooting

1. **PostgreSQL Connection Issues**:
   - Ensure PostgreSQL is running and the credentials in the `.env` file are correct.

2. **Redis Connection Issues**:
   - Ensure Redis is running on the default port `6379` and the credentials in the `.env` file are correct.

3. **Docker Issues**:
   - Make sure Docker is installed and running. If you face permission issues, try running Docker commands with `sudo`.

---
