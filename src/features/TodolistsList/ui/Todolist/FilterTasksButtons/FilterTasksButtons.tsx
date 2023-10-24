import { Button } from "@mui/material";
import React from "react";
import { useActions } from "common/hooks/useActions";
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from "features/TodolistsList/model/todolists/todolists-reducer";

type Props = {
  todolist: TodolistDomainType;
};
export const FilterTasksButtons = ({ todolist }: Props) => {
  const { changeTodolistFilter } = useActions(todolistsActions);
  const changeTodolistFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({ id: todolist.id, filter });
  };

  return (
    <>
      <Button
        variant={todolist.filter === "all" ? "outlined" : "text"}
        onClick={() => changeTodolistFilterHandler("all")}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={() => changeTodolistFilterHandler("active")}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={() => changeTodolistFilterHandler("completed")}
        color={"secondary"}
      >
        Completed
      </Button>
    </>
  );
};
