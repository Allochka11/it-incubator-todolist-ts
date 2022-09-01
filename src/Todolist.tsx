import { Button } from '@mui/material';
import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from "./components/AddItemForm";
import {EditableSpan} from "./components/EditableSpan";


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
    filter: FilterValuesType
    updateTask:(todolistId: string, taskId:string, newTitle:string) => void
    updateTodolist:(todolistId: string, newTitle:string)=>void
}

export function Todolist(props: PropsType) {
    const removeTodolist = () => props.removeTodolist(props.id)

    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);
    const addTaskHabdler = (newTitle:string) => {
      props.addTask(newTitle, props.id)
    }
    const updateTodolistHandler = (newTitle:string) => {
        props.updateTodolist(props.id,newTitle)
    }

    const updateTaskHandler = (newTitle: string, taskId:string) => {
        props.updateTask(props.id, taskId, newTitle)
    }



    return <div>
        <h3> <EditableSpan title={props.title} callback={updateTodolistHandler}/>
            <Button variant="contained" onClick={removeTodolist}>x</Button>

            {/*<button onClick={removeTodolist}>x</button>*/}
        </h3>
        <AddItemForm callback={addTaskHabdler} />
        <ul>
            {props.tasks &&
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <input type="checkbox" onChange={onChangeHandler} checked={t.isDone}/>
                        <EditableSpan title={t.title} callback={(newTitle)=>updateTaskHandler(newTitle,t.id)}/>
                        <Button variant="outlined" onClick={onClickHandler}>x</Button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={props.filter === 'all' ? "active-filter" : ""}
                    onClick={onAllClickHandler}>All
            </button>
            <button className={props.filter === 'active' ? "active-filter" : ""}
                    onClick={onActiveClickHandler}>Active
            </button>
            <button className={props.filter === 'completed' ? "active-filter" : ""}
                    onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}


