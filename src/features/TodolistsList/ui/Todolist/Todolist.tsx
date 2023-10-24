import React, { useCallback } from "react";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer";
import { TaskType } from "features/TodolistsList/api/tasks/tasks.types";
import { AddItemForm } from "common/components";
import { FilterTasksButtons } from "features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons";
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks";
import { TodolistsTitle } from "features/TodolistsList/ui/Todolist/TodolistsTitle";

type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Todolist = React.memo(function ({ todolist, tasks }: Props) {
  const dispatch = useAppDispatch();

  const addTaskCallback = useCallback(
    (title: string) => {
      return dispatch(tasksThunks.addTask({ title, todolistId: todolist.id })).unwrap();
    },
    [todolist.id],
  );

  return (
    <div>
      <TodolistsTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <div>
        <Tasks tasks={tasks} todolist={todolist} />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  );
});
