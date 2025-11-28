import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { taskService } from '../../services/task.service';
import { ValidationError } from '../../lib/validation';
import { CreateTaskDto, UpdateTaskDto } from '../../models/Task';

export class TaskController {
  // CREATE - Create a new task
  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const taskData: CreateTaskDto = {
        ...req.body,
        userId: req.user!.id, // Use authenticated user's ID
      };

      const task = await taskService.createTask(taskData);

      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  // READ - Get all tasks (with optional filters)
  async getAllTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, userId } = req.query;

      const filters: any = {};
      if (status) filters.status = status as string;
      if (userId) filters.userId = parseInt(userId as string);

      const tasks = await taskService.getAllTasks(filters);

      res.json({
        tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  // READ - Get task by ID
  async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const task = await taskService.getTaskById(taskId);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  // READ - Get tasks by authenticated user
  async getMyTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tasks = await taskService.getTasksByUserId(req.user!.id);

      res.json({
        tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      res.status(500).json({ error: 'Failed to fetch your tasks' });
    }
  }

  // UPDATE - Update a task
  async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      // Check if task exists and belongs to user
      const existingTask = await taskService.getTaskById(taskId);

      if (!existingTask) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (existingTask.userId !== req.user!.id) {
        res.status(403).json({ error: 'You can only update your own tasks' });
        return;
      }

      const updateData: UpdateTaskDto = req.body;
      const task = await taskService.updateTask(taskId, updateData);

      res.json({
        message: 'Task updated successfully',
        task,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }

  // DELETE - Delete a task
  async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      // Check if task exists and belongs to user
      const existingTask = await taskService.getTaskById(taskId);

      if (!existingTask) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (existingTask.userId !== req.user!.id) {
        res.status(403).json({ error: 'You can only delete your own tasks' });
        return;
      }

      await taskService.deleteTask(taskId);

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
}

export const taskController = new TaskController();
