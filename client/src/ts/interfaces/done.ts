import { TaskProperties } from './task-properties';

export interface Done extends TaskProperties {
  state: TodoStatus.done;
}