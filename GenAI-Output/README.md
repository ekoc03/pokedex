# Task Management REST API

A complete REST API scaffold for Task Management built with Node.js, Express, TypeScript, and Prisma.

## Features

- **CRUD Operations** for tasks
- **Input Validation** with detailed error messages
- **Basic Authentication** middleware
- **SQLite Database** with Prisma ORM
- **TypeScript** for type safety
- **Clean Architecture** with layered structure

## Project Structure

```
GenAI-Output/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   └── task.controller.ts    # Request handlers
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts    # Auth middleware
│   │   └── routes/
│   │       └── task.routes.ts        # Route definitions
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma client
│   │   └── validation.ts             # Validation utilities
│   ├── models/
│   │   └── Task.ts                   # TypeScript types & DTOs
│   ├── services/
│   │   └── task.service.ts           # Business logic
│   └── index.ts                      # Server entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` if needed (default port is 4000).

### 3. Setup Database

```bash
npm run db:setup
```

This will:
- Create the SQLite database
- Run migrations
- Generate Prisma client

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## API Endpoints

All endpoints require authentication via the `Authorization` header:
```
Authorization: Bearer user-{userId}
```

### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management API",
  "status": "pending",
  "dueDate": "2024-12-31"
}
```

### Get All Tasks
```http
GET /api/tasks
```

Optional query parameters:
- `status`: Filter by status (pending, in_progress, done)
- `userId`: Filter by user ID

### Get My Tasks
```http
GET /api/tasks/my-tasks
```

Returns tasks for the authenticated user.

### Get Task by ID
```http
GET /api/tasks/:id
```

### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress"
}
```

### Delete Task
```http
DELETE /api/tasks/:id
```

## Task Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | auto | Unique identifier |
| title | string | yes | Task title (max 200 chars) |
| description | string | yes | Task description |
| status | string | no | pending, in_progress, or done |
| dueDate | date | yes | Task due date |
| userId | number | yes | Owner of the task |

## Authentication

This demo uses a simple token format: `user-{userId}`

Example:
```
Authorization: Bearer user-1
```

In production, replace this with proper JWT authentication.

## Validation

All inputs are validated:
- **Title**: Required, non-empty, max 200 characters
- **Description**: Required, non-empty
- **Status**: Must be one of: pending, in_progress, done
- **Due Date**: Required, must be valid date
- **User ID**: Required, must be a number

## Error Responses

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not allowed to access resource)
- `404` - Not Found
- `500` - Server Error

Example error response:
```json
{
  "error": "Title is required and must be a string"
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:setup` - Setup database (migrate + generate)
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Testing the API

### Using cURL

```bash
# Create a task
curl -X POST http://localhost:4000/api/tasks \
  -H "Authorization: Bearer user-1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "description": "Testing the API",
    "status": "pending",
    "dueDate": "2024-12-31"
  }'

# Get all tasks
curl http://localhost:4000/api/tasks \
  -H "Authorization: Bearer user-1"

# Get my tasks
curl http://localhost:4000/api/tasks/my-tasks \
  -H "Authorization: Bearer user-1"

# Update a task
curl -X PUT http://localhost:4000/api/tasks/1 \
  -H "Authorization: Bearer user-1" \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Delete a task
curl -X DELETE http://localhost:4000/api/tasks/1 \
  -H "Authorization: Bearer user-1"
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Modern ORM
- **SQLite** - Lightweight database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Notes

- This is a demonstration scaffold generated by GenAI
- Authentication is simplified for demo purposes
- In production, implement proper JWT authentication
- Add comprehensive error logging
- Implement rate limiting
- Add API documentation (Swagger/OpenAPI)
- Add unit and integration tests
- Consider pagination for large datasets
