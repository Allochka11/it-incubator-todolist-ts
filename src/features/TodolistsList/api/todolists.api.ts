import { instance, ResponseType, TaskPriorities, TaskStatuses } from "common/api/baseApi";
import {
  AddTaskArgType,
  GetTasksResponse,
  RemoveTaskArgType,
  TaskType,
  TodolistType,
  UpdateTaskArgType,
} from "features/TodolistsList/api/todolist.types";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${id}`, { title: title });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(arg: RemoveTaskArgType) {
    return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
  },
  createTask(arg: AddTaskArgType) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title });
  },
  updateTask(arg: UpdateTaskArgType) {
    return instance.put<ResponseType<TaskType>>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`, arg.model);
  },
};
