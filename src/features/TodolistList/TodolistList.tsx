import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {
    changeTodolistFilterAC, changeTodolistTitleTC, createTodolistTC,
    FilterValuesType,
    removeTodolistTC, setTodolistsTC,
    TodolistDomainType
} from "./todolists-reducer";
import {addTaskTC, removeTaskTC, updateTaskStatusTitleTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../app/App";
import {Navigate} from "react-router-dom";

type TodolistListType = {
    // todolists: TodolistDomainType
}

const TodolistList: React.FC<TodolistListType> = () => {

    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);

    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!isLoggedIn) return
        dispatch(setTodolistsTC())
    }, []);

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskTC(todolistId,id))
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC(title,todolistId));
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskStatusTitleTC(todolistId,id, {status}))
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        // const action = changeTaskTitleTC(id, newTitle, todolistId);
        dispatch(updateTaskStatusTitleTC(todolistId, id, {title:newTitle}));
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleTC(id,title))
    }, []);

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title));
    }, [dispatch]);

    if(!isLoggedIn) {
        return <Navigate to={'/login'}></Navigate>
    }
    return(
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist} />
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={allTodolistTasks}
                                    entityStatus={tl.entityStatus}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>


        </>
    );
};
export default TodolistList;