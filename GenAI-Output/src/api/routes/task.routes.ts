import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { taskController } from '../controllers/task.controller';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// CREATE - Create a new task
router.post('/', (req, res) => taskController.createTask(req, res));

// READ - Get all tasks (with optional filters)
router.get('/', (req, res) => taskController.getAllTasks(req, res));

// READ - Get authenticated user's tasks
router.get('/my-tasks', (req, res) => taskController.getMyTasks(req, res));

// READ - Get task by ID
router.get('/:id', (req, res) => taskController.getTaskById(req, res));

// UPDATE - Update a task
router.put('/:id', (req, res) => taskController.updateTask(req, res));

// DELETE - Delete a task
router.delete('/:id', (req, res) => taskController.deleteTask(req, res));

export default router;
