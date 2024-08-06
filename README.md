# Task and Project Management API

## Overview

This API allows you to manage tasks and projects. It supports CRUD operations for tasks and projects, task assignment to projects, and various filtering and searching functionalities.

## Features

- **Tasks Management:**

  - Create, edit, delete, list tasks
  - Mark tasks as "to-do" or "done"
  - Filter tasks by status
  - Search tasks by name
  - Sort tasks by dates (start date, due date, done date)

- **Projects Management:**

  - Create, edit, delete, list projects
  - Assign tasks to projects
  - Filter tasks by project name
  - Sort projects by dates (start date, due date)

- **Bonus Aggregations:**
  - Projects with tasks due today
  - Tasks with projects due today

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the repository:**
   git clone https://github.com/dineshbellamkonda12/todoListAPI.git
   cd your-repo

2. **Install dependencies:**
   npm install

3. **Run MongoDB:**
   Make sure MongoDB is running locally on the default port (27017). You can start MongoDB using:

   mongod

4. **Start the server:**
   node server.js

The server will start and listen on port 3000 by default.

## API Endpoints

### Tasks

- **Create a Task**

  - `POST /api/tasks`
  - **Request Body:**
    ```json
    {
      "name": "Task Name",
      "description": "Task Description",
      "status": "to-do",
      "startDate": "2024-08-01",
      "dueDate": "2024-08-10",
      "doneDate": null,
      "projectId": "project_id_here"
    }
    ```

- **List All Tasks**

  - `GET /api/tasks`

- **Edit a Task**

  - `PUT /api/tasks/:id`
  - **Request Body:**
    ```json
    {
      "name": "Updated Task Name",
      "description": "Updated Task Description",
      "status": "done",
      "startDate": "2024-08-01",
      "dueDate": "2024-08-10",
      "doneDate": "2024-08-05",
      "projectId": "new_project_id_here"
    }
    ```

- **Delete a Task**

  - `DELETE /api/tasks/:id`

- **Mark Task as To-Do/Done**

  - `PATCH /api/tasks/:id/status`
  - **Request Body:**
    ```json
    {
      "status": "done"
    }
    ```

- **Filter Tasks by Status**

  - `GET /api/tasks/filter/:status`
  - **Status** can be `to-do` or `done`.

- **Search Tasks by Name**

  - `GET /api/tasks/search/:name`
  - **Name** should be URL-encoded if it contains spaces.

- **Sort Tasks by Dates**
  - `GET /api/tasks/sort/:dateField`
  - **Date Field** can be `startDate`, `dueDate`, or `doneDate`.

### Projects

- **Create a Project**

  - `POST /api/projects`
  - **Request Body:**
    ```json
    {
      "name": "Project Name",
      "description": "Project Description",
      "startDate": "2024-08-01",
      "dueDate": "2024-09-01"
    }
    ```

- **List All Projects**

  - `GET /api/projects`

- **Edit a Project**

  - `PUT /api/projects/:id`
  - **Request Body:**
    ```json
    {
      "name": "Updated Project Name",
      "description": "Updated Project Description",
      "startDate": "2024-08-12",
      "dueDate": "2024-09-12"
    }
    ```

- **Delete a Project**

  - `DELETE /api/projects/:id`

- **Assign a Task to a Project**

  - `PATCH /api/tasks/:id/project`
  - **Request Body:**
    ```json
    {
      "newProjectId": "new_project_id_here"
    }
    ```

- **Filter Tasks by Project Name**

  - `GET /api/tasks/filter/project/:name`

- **Sort Projects by Dates**
  - `GET /api/projects/sort/:dateField`
  - **Date Field** can be `startDate` or `dueDate`.

### Bonus Aggregations

- **Projects with Tasks Due Today**

  - Run the aggregation script in `aggregations.js`.

- **Tasks with Projects Due Today**
  - Run the aggregation script in `aggregations.js`.

## Testing

You can test the API endpoints using Postman or any other API testing tool. Follow the example requests provided in the endpoints section.

### Sample Data for Testing in Postman

- **Create a Project**

  ```json
  {
    "name": "New Project",
    "description": "Project Description",
    "startDate": "2024-08-01",
    "dueDate": "2024-09-01"
  }
  ```

- **Create a Task**

  ```json
  {
    "name": "New Task",
    "description": "Task Description",
    "status": "to-do",
    "startDate": "2024-08-01",
    "dueDate": "2024-08-10",
    "doneDate": null,
    "projectId": "project_id_here"
  }
  ```

- **Search Tasks by Name**

  - URL: `http://localhost:3000/api/tasks/search/New%20Task`

- **List all Projects**
  - URL: `http://localhost:3000/api/projects`

## License

This project is licensed under the MIT License. See the (LICENSE) file for details.

## Contact

For any questions, please reach me out at [dineshchowdary326@gmail.com].
