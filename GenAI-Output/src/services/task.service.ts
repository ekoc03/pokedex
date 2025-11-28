import { prisma } from '../lib/prisma';
import { CreateTaskDto, UpdateTaskDto, Task, TaskFilters } from '../models/Task';
import { validateCreateTask, validateUpdateTask } from '../lib/validation';

class TaskService {
  async createTask(data: CreateTaskDto): Promise<Task> {
    validateCreateTask(data);

    const task = await prisma.task.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        status: data.status || 'pending',
        dueDate: new Date(data.dueDate),
        userId: data.userId,
      },
    });

    return task;
  }

  async getAllTasks(filters?: TaskFilters): Promise<Task[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        dueDate: 'asc',
      },
    });

    return tasks;
  }

  async getTaskById(id: number): Promise<Task | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    return task;
  }

  async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    validateUpdateTask(data);

    const updateData: any = {};

    if (data.title) updateData.title = data.title.trim();
    if (data.description) updateData.description = data.description.trim();
    if (data.status) updateData.status = data.status;
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return task;
  }

  async deleteTask(id: number): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return this.getAllTasks({ userId });
  }
}

export const taskService = new TaskService();
