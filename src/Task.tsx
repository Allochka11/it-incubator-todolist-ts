import React, {ChangeEvent, memo, useCallback} from "react";
import {Checkbox} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC} from "./state/tasks-reducer";
import {TaskType} from "./TodolistWithRedux";
import {Dispatch} from "redux";

type TaskPropsType = {
    task: TaskType
    todolistId:string
    dispatch:Dispatch
}

export const Task = memo(({task, todolistId, dispatch}: TaskPropsType) => {
    console.log('task')
    const {id, title, isDone} = task

    // const dispatch = useDispatch()
    const onClickHandler = useCallback(() => dispatch(RemoveTaskAC(id, todolistId)), [dispatch, id, todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(ChangeTaskStatusAC(id, newIsDoneValue, todolistId));
    },[dispatch, id, todolistId])
    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(ChangeTaskTitleAC(id, newValue, todolistId));
    }, [dispatch, id, todolistId  ])

    return <div key={id} className={isDone ? "is-done" : ""}>
        <Checkbox
            checked={isDone}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
});