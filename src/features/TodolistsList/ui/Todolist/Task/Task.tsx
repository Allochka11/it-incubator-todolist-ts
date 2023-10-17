import React, { ChangeEvent, useCallback, useState } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "common/api/baseApi";
import { EditableSpan } from "common/components";
import { TaskType } from "features/TodolistsList/api/tasks/tasks.types";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer";
import { useActionData } from "react-router-dom";
import { useActions } from "common/hooks/useActions";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo((props: TaskPropsType) => {
  let [disabledBtn, setDisabledBtn] = useState(false);

  const { removeTask, updateTask } = useActions(tasksThunks);
  const removeTaskHandler = () => {
    removeTask({ todolistId: props.todolistId, taskId: props.task.id });
    setDisabledBtn(true);
  };

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({
      taskId: props.task.id,
      todolistId: props.todolistId,
      model: { status },
    });
  };

  const changeTaskTitleHandler = (title: string) => {
    updateTask({ taskId: props.task.id, todolistId: props.todolistId, model: { title } });
  };

  return (
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeTaskStatusHandler}
      />
      <EditableSpan value={props.task.title} onChange={changeTaskTitleHandler} />
      <IconButton onClick={removeTaskHandler} disabled={disabledBtn}>
        <Delete />
      </IconButton>
    </div>
  );
});
