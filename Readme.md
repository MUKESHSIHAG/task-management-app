# Task Management App

This is a full-stack task management application built with a Node.js/Express backend, a React frontend, and PostgreSQL as the database. The application allows users to create, update, delete, and manage tasks and boards.

## Note: First start the backend and then frontend

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js**
- **npm**
- **PostgreSQL**

## Database Setup

Ensure that PostgreSQL is installed on your system and the following are set up:

- A database named `task_management`.
- A user named `postgres` with the appropriate password (e.g., `12345678`).
- The necessary tables: tasks and boards.
- I've used the below command to create the tables
    ```
    CREATE TABLE boards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );

    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        board_id INTEGER REFERENCES boards(id),
        status VARCHAR(50) NOT NULL
    );
    ```

## Backend Setup

1. **Navigate to the Backend Folder**:
    ```
        cd backend
        npm install
        node index.js
    ```
    The backend server will start running on `http://localhost:5000`.

## Frontend Setup

2. **Navigate to the Frontend Folder**:
    ```
        cd frontend
        npm install
        npm start
    ```
    The frontend server will start running on `http://localhost:3000`.

## Application Structure
- Backend: The backend folder contains the Node.js/Express server and database connection logic. It interacts with the PostgreSQL database to manage tasks and boards.

- Frontend: The frontend folder contains the React application.


