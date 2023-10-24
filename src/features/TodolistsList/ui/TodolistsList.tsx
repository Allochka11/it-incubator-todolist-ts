import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer";
import { Grid, Paper } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { isLoggedInSelector, tasksSelector, todolistsSelector } from "app/app.selector";
import { AddItemForm } from "common/components";
import { Todolist } from "./Todolist/Todolist";

export const TodolistsList = () => {
  const todolists = useSelector(todolistsSelector);
  const tasks = useSelector(tasksSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(todolistsThunks.fetchTodolists());
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      return dispatch(todolistsThunks.addTodolist({ title })).unwrap();
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
                <Todolist todolist={tl} tasks={allTodolistTasks} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
