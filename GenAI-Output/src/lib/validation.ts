import { CreateTaskDto, UpdateTaskDto, TaskStatus } from '../models/Task';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const VALID_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'done'];

export function validateCreateTask(data: CreateTaskDto): void {
  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    throw new ValidationError('Title is required and must be a string');
  }
  if (data.title.trim().length === 0) {
    throw new ValidationError('Title cannot be empty');
  }
  if (data.title.length > 200) {
    throw new ValidationError('Title must be less than 200 characters');
  }

  // Description validation
  if (!data.description || typeof data.description !== 'string') {
    throw new ValidationError('Description is required and must be a string');
  }
  if (data.description.trim().length === 0) {
    throw new ValidationError('Description cannot be empty');
  }

  // Status validation
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    throw new ValidationError(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Due date validation
  if (!data.dueDate) {
    throw new ValidationError('Due date is required');
  }
  const dueDate = new Date(data.dueDate);
  if (isNaN(dueDate.getTime())) {
    throw new ValidationError('Invalid due date format');
  }

  // User ID validation
  if (!data.userId || typeof data.userId !== 'number') {
    throw new ValidationError('User ID is required and must be a number');
  }
}

export function validateUpdateTask(data: UpdateTaskDto): void {
  // Title validation (optional)
  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      throw new ValidationError('Title must be a string');
    }
    if (data.title.trim().length === 0) {
      throw new ValidationError('Title cannot be empty');
    }
    if (data.title.length > 200) {
      throw new ValidationError('Title must be less than 200 characters');
    }
  }

  // Description validation (optional)
  if (data.description !== undefined) {
    if (typeof data.description !== 'string') {
      throw new ValidationError('Description must be a string');
    }
    if (data.description.trim().length === 0) {
      throw new ValidationError('Description cannot be empty');
    }
  }


  if (data.status && !VALID_STATUSES.includes(data.status)) {
    throw new ValidationError(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      throw new ValidationError('Invalid due date format');
    }
  }

  if (!data.title && !data.description && !data.status && !data.dueDate) {
    throw new ValidationError('At least one field must be provided for update');
  }
}
