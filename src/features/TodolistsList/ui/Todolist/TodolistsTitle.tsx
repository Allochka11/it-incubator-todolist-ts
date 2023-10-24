import { EditableSpan } from "common/components";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import React, { useCallback } from "react";
import { TodolistDomainType, todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer";
import { useActions } from "common/hooks/useActions";

type Props = {
  todolist: TodolistDomainType;
};

export const TodolistsTitle = ({ todolist }: Props) => {
  const { changeTodolistTitle, removeTodolist } = useActions(todolistsThunks);
  const removeTodolistHandler = () => {
    removeTodolist({ todolistId: todolist.id });
  };

  const changeTodolistTitleCallback = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: todolist.id, title });
    },
    [todolist.id],
  );

  return (
    <>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback} />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
    </>
  );
};
