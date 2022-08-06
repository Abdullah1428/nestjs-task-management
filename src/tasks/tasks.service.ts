import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepo } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private tasksRepository: TasksRepo) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id,
        user,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const deleted = await this.tasksRepository.delete({ id, user });

    if (deleted.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }
}
