export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  dueDate: string; // ISO date string
  userId: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  userId?: number;
}
