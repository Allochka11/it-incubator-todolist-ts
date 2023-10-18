import React, { ChangeEvent, useState } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "common/api/baseApi";
import { EditableSpan } from "common/components";
import { TaskType } from "features/TodolistsList/api/tasks/tasks.types";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer";
import { useActions } from "common/hooks/useActions";
import s from "./Task.module.css";

type Props = {
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo(({ task, todolistId }: Props) => {
  let [disabledBtn, setDisabledBtn] = useState(false);

  const { removeTask, updateTask } = useActions(tasksThunks);
  const removeTaskHandler = () => {
    removeTask({ todolistId: todolistId, taskId: task.id });
    setDisabledBtn(true);
  };

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({
      taskId: task.id,
      todolistId: todolistId,
      model: { status },
    });
  };

  const changeTaskTitleHandler = (title: string) => {
    updateTask({ taskId: task.id, todolistId: todolistId, model: { title } });
  };

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeTaskStatusHandler} />
      <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
      <IconButton onClick={removeTaskHandler} disabled={disabledBtn}>
        <Delete />
      </IconButton>
    </div>
  );
});
