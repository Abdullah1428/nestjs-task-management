import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable() // makes this singleton that can be shared across the application
export class TasksService {
  private tasks: Task[] = [];

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    let tasks = await this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const found = await this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    return task;
  }
}
