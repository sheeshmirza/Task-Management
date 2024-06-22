# Task Management System (GraphQL)

This project is a GraphQL-based Task Management System designed to facilitate task creation, updation, deletion, and user management within organizations.

## Features

- **User Management:**

  - User Registration with role assignment (admin, manager, user)
  - User Login with JWT authentication
  - Role-based Access Control (RBAC)

- **Task Operations:**

  - Create, Update, Delete Tasks
  - Assign Tasks to Users
  - Query Tasks

- **Organization Management:**
  - Create and manage organizations

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework for Node.js
- **GraphQL** - Query language for APIs
- **Apollo Server** - GraphQL server for Express
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **bcryptjs** - Password hashing library
- **jsonwebtoken** - JSON Web Token (JWT) library
- **dotenv** - Environment variable management

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sheeshmirza/task-management.git
   cd task-management
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```plaintext
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/task_management
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run start:dev
   ```

## GraphQL API

### User Management

- **Register User**

  - **Mutation**: `createUser`
  - **Request**:
    ```graphql
    mutation {
      createUser(
        input: {
          username: "john_doe"
          password: "password123"
          role: admin
          organizationName: "organization_name"
        }
      ) {
        username
        role
      }
    }
    ```
  - **Response**:
    ```json
    {
      "data": {
        "createUser": {
          "username": "john_doe",
          "role": "admin"
        }
      }
    }
    ```

- **Login User**

  - **Mutation**: `loginUser`
  - **Request**:
    ```graphql
    mutation {
      loginUser(username: "john_doe", password: "password123") {
        token
        user {
          username
          role
        }
      }
    }
    ```
  - **Response**:
    ```json
    {
      "data": {
        "loginUser": {
          "token": "jwt_token_here",
          "user": {
            "username": "john_doe",
            "role": "admin"
          }
        }
      }
    }
    ```

### Task Management

- **Create Task**

  - **Mutation**: `createTask`
  - **Request**:
    ```graphql
    mutation {
      createTask(
        input: {
          title: "Implement GraphQL Resolvers"
          description: "Write resolvers for Task operations"
          status: todo
          userId: "user_id_here"
          organizationId: "organization_id_here"
        }
      ) {
        title
        description
        status
      }
    }
    ```
  - **Response**:
    ```json
    {
      "data": {
        "createTask": {
          "title": "Implement GraphQL Resolvers",
          "description": "Write resolvers for Task operations",
          "status": "todo"
        }
      }
    }
    ```

- **Update Task**

  - **Mutation**: `updateTask`
  - **Request**:
    ```graphql
    mutation {
      updateTask(
        id: "task_id_here"
        input: {
          title: "Implement GraphQL Resolvers (Updated)"
          status: in_progress
        }
      ) {
        title
        description
        status
      }
    }
    ```
  - **Response**:
    ```json
    {
      "data": {
        "updateTask": {
          "title": "Implement GraphQL Resolvers (Updated)",
          "description": "Write resolvers for Task operations",
          "status": "in_progress"
        }
      }
    }
    ```

- **Delete Task**

  - **Mutation**: `deleteTask`
  - **Request**:
    ```graphql
    mutation {
      deleteTask(id: "task_id_here") {
        title
      }
    }
    ```
  - **Response**:
    ```json
    {
      "data": {
        "deleteTask": {
          "title": "Implement GraphQL Resolvers (Updated)"
        }
      }
    }
    ```

- **List Tasks**

  - **Query**: `tasks`
  - **Request**:
    ```graphql
    query {
      tasks {
        title
        description
        status
      }
    }
    ```
  - **Response**:
    ```json
    {
      "data": {
        "tasks": [
          {
            "title": "Implement GraphQL Resolvers (Updated)",
            "description": "Write resolvers for Task operations",
            "status": "in_progress"
          },
          ...
        ]
      }
    }
    ```

### Organization Management

- **List Organizations**

  - **Query**: `organizations`
  - **Request**:
    ```graphql
    query {
      organizations {
        name
      }
    }
    ```
  - **Response**:
    ```json
    {
      "data": {
        "organizations": [
          {
            "name": "Organization A"
          },
          ...
        ]
      }
    }
    ```
