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
import { Task } from "./Task/Task";
import { useActions } from "common/hooks/useActions";

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
  const { changeTodolistTitle, removeTodolist } = useActions(todolistsThunks);
  const { changeTodolistFilter } = useActions(todolistsActions);

  const addTaskCallback = useCallback(
    (title: string) => {
      addTask({ title, todolistId: props.todolist.id });
    },
    [props.todolist.id],
  );

  const removeTodolistHandler = () => {
    removeTodolist({ todolistId: props.todolist.id });
  };

  const changeTodolistTitleCallback = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: props.todolist.id, title });
    },
    [props.todolist.id],
  );

  // const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
  //   const action = todolistsActions.changeTodolistFilter({ id: todolistId, filter: value });
  //   dispatch(action);
  // }, []);

  const onAllClickHandler = useCallback(
    () => changeTodolistFilter({ id: props.todolist.id, filter: "all" }),
    [props.todolist.id],
  );

  const onActiveClickHandler = useCallback(
    () => changeTodolistFilter({ id: props.todolist.id, filter: "active" }),
    [props.todolist.id],
  );
  const onCompletedClickHandler = useCallback(
    () => changeTodolistFilter({ id: props.todolist.id, filter: "completed" }),
    [props.todolist.id],
  );

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback} />
        <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={props.todolist.id} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={props.todolist.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={props.todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
