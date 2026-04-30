# Team Task Manager

A full-stack web application built with React, Node.js, Express, and MongoDB. It features role-based access control (Admin and Member), project management, and task tracking.

## Features

- **Authentication**: JWT-based login and registration. Passwords hashed with bcrypt.
- **Roles**: 
  - **Admin**: Can create projects, add/remove members, create tasks, edit any task.
  - **Member**: Can view assigned projects and update the status of assigned tasks.
- **Project Management**: Create and manage projects, assign team members.
- **Task Management**: Create tasks within projects, assign them to members, set status (Todo, In Progress, Done) and due dates.
- **Dashboard**: Overview of total tasks, completed tasks, and overdue tasks.

## Tech Stack

- **Frontend**: React, Tailwind CSS v4, Vite, Axios, React Router, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs

## Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following (already provided for local setup):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=supersecretjwtkeyforlocaldev
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment on Railway

1. **Database**: 
   - Set up a MongoDB cluster on MongoDB Atlas.
   - Obtain the connection string.

2. **Backend Deployment**:
   - Create a new project on Railway.
   - Connect your GitHub repository.
   - Choose the `/backend` folder as the root directory for this service.
   - Add environment variables (`MONGODB_URI`, `JWT_SECRET`, `PORT`).
   - Railway will automatically detect the Node.js project and deploy it.

3. **Frontend Deployment**:
   - Update the `baseURL` in `frontend/src/api/axios.js` to point to your deployed backend URL.
   - Create a new service on Railway.
   - Choose the `/frontend` folder as the root.
   - Ensure the build command is `npm run build` and output directory is `dist`.

## License
MIT
