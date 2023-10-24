import React, { useCallback, useEffect } from "react";
import { TaskStatuses } from "common/api/baseApi";
import {
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/model/todolists/todolists-reducer";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer";
import { TaskType } from "features/TodolistsList/api/tasks/tasks.types";
import { AddItemForm, EditableSpan } from "common/components";
import { Task } from "./Tasks/Task/Task";
import { useActions } from "common/hooks/useActions";
import { FilterTasksButtons } from "features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons";
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks";
import { TodolistsTitle } from "features/TodolistsList/ui/Todolist/TodolistsTitle";

type Props = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist = React.memo(function ({ demo = false, ...props }: Props) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (demo) {
      dispatch(tasksThunks.fetchTasks(props.todolist.id));
    }
  }, []);

  const { addTask } = useActions(tasksThunks);

  const addTaskCallback = useCallback(
    (title: string) => {
      addTask({ title, todolistId: props.todolist.id });
    },
    [props.todolist.id],
  );

  return (
    <div>
      <TodolistsTitle todolist={props.todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        <Tasks tasks={props.tasks} todolist={props.todolist} />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={props.todolist} />
      </div>
    </div>
  );
});
