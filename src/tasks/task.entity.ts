import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TaskStatus } from './tasks.model';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}
