import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';
export interface TasksRepo extends Repository<Task> {
  this: Repository<Task>;
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>;
}

export const TasksRepository: Pick<TasksRepo, 'createTask' | 'getTasks'> = {
  async createTask(
    this: Repository<Task>,
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  },

  async getTasks(
    this: Repository<Task>,
    filterDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  },
};
