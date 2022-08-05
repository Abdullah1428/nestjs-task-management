import { Injectable } from '@nestjs/common';

@Injectable() // makes this singleton that can be shared across the application
export class TasksService {
  private tasks = [];

  getAllTasks() {
    return this.tasks;
  }
}
