import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  addTodolistTC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  todolistsActions,
} from "features/TodolistsList/model/todolists-reducer";
import { tasksThunks } from "features/TodolistsList/model/tasks-reducer";
import { TaskStatuses } from "common/api/baseApi";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "features/TodolistsList/ui/Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { isLoggedInSelector, tasksSelector, todolistsSelector } from "app/app.selector";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(todolistsSelector);
  const tasks = useSelector(tasksSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    const thunk = fetchTodolistsTC();
    dispatch(thunk);
  }, []);

  const removeTask = useCallback(function (id: string, todolistId: string) {
    const thunk = tasksThunks.removeTask({ todolistId: todolistId, taskId: id });
    dispatch(thunk);
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunks.addTask({ todolistId, title }));
  }, []);

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    const thunk = tasksThunks.updateTask({ taskId: id, model: { status }, todolistId: todolistId });
    dispatch(thunk);
  }, []);

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    // const thunk = updateTaskTC(id, { title: newTitle }, todolistId);
    const thunk = tasksThunks.updateTask({ taskId: id, model: { title: newTitle }, todolistId: todolistId });
    dispatch(thunk);
  }, []);

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    const action = todolistsActions.changeTodolistFilter({ id: todolistId, filter: value });
    dispatch(action);
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    const thunk = removeTodolistTC(id);
    dispatch(thunk);
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    const thunk = changeTodolistTitleTC(id, title);
    dispatch(thunk);
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title);
      dispatch(thunk);
    },
    [dispatch],
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
