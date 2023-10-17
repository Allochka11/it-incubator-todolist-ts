import { BaseResponseType, instance } from "common/api";

import {
  AddTaskArgType,
  GetTasksResponse,
  RemoveTaskArgType,
  TaskType,
  UpdateTaskArgType,
} from "features/TodolistsList/api/index";

export const tasksAPI = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(arg: RemoveTaskArgType) {
    return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
  },
  createTask(arg: AddTaskArgType) {
    return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {
      title: arg.title,
    });
  },
  updateTask(arg: UpdateTaskArgType) {
    return instance.put<BaseResponseType<TaskType>>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`, arg.model);
  },
};
