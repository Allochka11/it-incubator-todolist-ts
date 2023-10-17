import { AppRootStateType } from "app/store";
import { RequestStatusType } from "app/app-reducer";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists-reducer";
import { TasksStateType } from "features/TodolistsList/model/tasks/tasks-reducer";

export const statusSelector = (state: AppRootStateType): RequestStatusType => state.app.status;
export const isInitializedSelector = (state: AppRootStateType): boolean => state.app.isInitialized;
export const isLoggedInSelector = (state: AppRootStateType): boolean => state.auth.isLoggedIn;
export const errorSelector = (state: AppRootStateType): string | null => state.app.error;
export const todolistsSelector = (state: AppRootStateType): TodolistDomainType[] => state.todolists;
export const tasksSelector = (state: AppRootStateType): TasksStateType => state.tasks;
