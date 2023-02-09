import React, {memo, useCallback} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import IconButton from '@mui/material/IconButton/IconButton';
import {Delete} from "@mui/icons-material";
import {Button} from "@mui/material";
import {TodolistType} from "./AppWithReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {AddTaskAC} from "./state/tasks-reducer";
import {ChangeTodolistFilterAC, ChangeTodolistTitleAC, RemoveTodolistAC} from "./state/todolists-reducer";
import {Task} from "./Task";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export const TodolistWithRedux = memo(({todolist}: PropsType) => {
    const {id, title, filter} = todolist;

    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id]);
    let dispatch = useDispatch();

    const addTask = useCallback((title: string) => {
        dispatch(AddTaskAC(title, id));
    }, [dispatch, id])

    const removeTodolist = useCallback(() => {
        dispatch(RemoveTodolistAC(id))
    }, [dispatch, id])
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(ChangeTodolistTitleAC(id, title))
    }, [dispatch, id])

    const onAllClickHandler = useCallback(() => dispatch(ChangeTodolistFilterAC(id, "all")), [dispatch, id]);
    const onActiveClickHandler = useCallback(() => dispatch(ChangeTodolistFilterAC(id, "active")), [dispatch, id]);
    const onCompletedClickHandler = useCallback(() => dispatch(ChangeTodolistFilterAC(id, "completed")), [dispatch, id]);

    // const filteredTasks = useCallback((tasks: TaskType[], filter: FilterValuesType): TaskType[] => {
    // switch (filter) {
    //     case "completed": return tasks.filter(t => t.isDone);
    //     case "active":tasks.filter(t => !t.isDone);
    //     default:return  ta
    // }
    // }, [])

    if (filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }


    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks.map(t => {

                    return <Task task={t} todolistId={id} key={t.id} dispatch={dispatch}/>
                })
            }
        </div>
        <div>
            <ButtonMemo onClick={onAllClickHandler} color={'inherit'} variant={filter === 'all' ? 'outlined' : 'text'} title={'All'}/>
            <ButtonMemo onClick={onActiveClickHandler} color={'primary'} variant={filter === 'active' ? 'outlined' : 'text'} title={'Active'}/>
            <ButtonMemo onClick={onCompletedClickHandler} color={'secondary'} variant={filter === 'completed' ? 'outlined' : 'text'} title={'Completed'}/>
        </div>
    </div>
});

type ButtonMemoType = {
    onClick: () => void
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    variant: 'text' | 'outlined' | 'contained'
    title: string
}

const ButtonMemo = memo((props: ButtonMemoType) => {
    return (
        <Button variant={props.variant}
                onClick={props.onClick}
                color={props.color}>{props.title}
        </Button>
    )
})




