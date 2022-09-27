import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from '@mui/icons-material';
import {CheckboxComponent} from "./components/CheckboxComponent";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export function Todolist(props: PropsType) {
    const addTask = (title: string) => {
        props.addTask(title, props.id);
    }

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title);
    }

    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);

    const onChangeStatus = (checked: boolean, tId: string) => {
        props.changeTaskStatus(tId, checked, props.id)
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} aria-label='delete'>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        props.changeTaskTitle(t.id, newValue, props.id);
                    }

                    // const onChangeStatus = (checked: boolean) => {
                    //     props.changeTaskStatus(t.id,checked,props.id)
                    // }


                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        {/*<Checkbox defaultChecked style={{color: 'pink'}} onChange={onChangeHandler} checked={t.isDone}/>*/}
                        <CheckboxComponent callback={(checked) => onChangeStatus(checked, t.id)} checked={t.isDone}/>

                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton onClick={onClickHandler} aria-label='delete'>
                            <Delete/>
                        </IconButton>

                    </li>
                })
            }
        </ul>
        <div>
            <Button color={"secondary"} variant={props.filter === 'all' ? "outlined" : "contained"}
                    onClick={onAllClickHandler} size={"small"}>All
            </Button>
            <Button color={"secondary"} variant={props.filter === 'active' ? "outlined" : "contained"}
                    onClick={onActiveClickHandler} size={"small"}>Active
            </Button>
            <Button color={"secondary"} variant={props.filter === 'completed' ? "outlined" : "contained"}
                    onClick={onCompletedClickHandler} size={"small"}>Completed
            </Button>
        </div>
    </div>
}


