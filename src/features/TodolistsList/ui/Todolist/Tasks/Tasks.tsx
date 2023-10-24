import { TaskStatuses } from "common/api";
import { Task } from "features/TodolistsList/ui/Todolist/Tasks/Task/Task";
import React from "react";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists-reducer";
import { TaskType } from "features/TodolistsList/api";

type Props = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
};

export const Tasks = ({ tasks, todolist }: Props) => {
  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((task) => task.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((task) => task.status === TaskStatuses.Completed);
  }

  return (
    <>
      {tasksForTodolist.map((task) => (
        <Task key={task.id} task={task} todolistId={todolist.id} />
      ))}
    </>
  );
};
