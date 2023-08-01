
Task Tracker Documentation
==========================

Introduction
------------

Welcome to the Task Tracker API documentation. This API allows users to manage tasks and track their progress. The Task Tracker API provides endpoints for creating tasks, listing all tasks, getting a specific task by its ID, deleting a task, updating a task, bulk adding tasks, and bulk deleting tasks. It also provides user authentication using Passport.js and bcrypt for user registration and login.

Table of Contents
-----------------

1.  [Getting Started](#getting-started)
2.  [Authentication](#authentication)
3.  [Endpoints](#endpoints)

Getting Started
---------------

### Installation

To install the Task Tracker API, follow these steps:

    git clone https://github.com/marrwan/fittedng.git
    cd fittedng
    npm install

### Running the Server

To start the Task Tracker API server, use the following command:

    npm run dev

The server will run on `http://localhost:3000` by default.

Authentication
--------------

The Task Tracker API uses Passport.js and bcrypt for user authentication. Users can register a new account and log in to access protected routes.

### User Registration

Users can register a new account by sending a POST request to the `/v1/auth/register` endpoint with the following JSON payload:

    {
      "username": "your_username",
      "password": "your_password",
      "role": "admin"
    }

The `role` field can be either "user" or "admin".

### User Login

To log in, users should send a POST request to the `/v1/auth/login` endpoint with the following JSON payload:

    {
      "username": "your_username",
      "password": "your_password"
    }

Upon successful login, the API will return a JWT token that must be included in the Authorization header for protected routes.

Endpoints
---------

### Create a New Task

Users can create a new task by sending a POST request to the `/v1/tasks` endpoint with the following JSON payload:

    {
      "title": "Your Task Title"
    }

The API will respond with a unique `id` for the newly created task.

### List All Tasks

To list all tasks, users can send a GET request to the `/v1/tasks` endpoint. The API will respond with an array of tasks, each containing `id`, `title`, and `is_completed` properties.

### Get a Specific Task

To retrieve a specific task, users can send a GET request to the `/v1/tasks/{id}` endpoint, where `{id}` is the ID of the task. The API will respond with the task details or a 404 error if the task does not exist.

### Delete a Task

Users can delete a task by sending a DELETE request to the `/v1/tasks/{id}` endpoint, where `{id}` is the ID of the task to be deleted. The API will respond with a 204 status code on success or a 404 error if the task does not exist.

### Update a Task

To update the title or completion status of a task, users can send a PUT request to the `/v1/tasks/{id}` endpoint with the following JSON payload:

    {
      "title": "Updated Task Title",
      "is_completed": true
    }

The API will respond with a 204 status code on success or a 404 error if the task does not exist.

### Bulk Add Tasks

Users can bulk add multiple tasks in one request by sending a POST request to the `/v1/tasks` endpoint with the following JSON payload:

    {
      "tasks": [
        { "title": "Task 1", "is_completed": false },
        { "title": "Task 2", "is_completed": true },
        { "title": "Task 3", "is_completed": false }
      ]
    }

The API will respond with an array of `id` values for the newly created tasks.

### Bulk Delete Tasks

To bulk delete multiple tasks, users can send a DELETE request to the `/v1/tasks` endpoint with the following JSON payload:

    {
      "tasks": [
        { "id": "task_id_1" },
        { "id": "task_id_2" },
        { "id": "task_id_3" }
      ]
    }

The API will respond with a 204 status code on success.
