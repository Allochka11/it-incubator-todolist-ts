import { BaseResponseType, instance } from "common/api";

import { TodolistType } from "features/TodolistsList/api/index";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<BaseResponseType>(`todo-lists/${id}`, { title: title });
  },
};
