import React, {Reducer, useReducer} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar/AppBar';
import {Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    AddTodolistAC, ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    TodolistsActionsType,
    todolistsReducer
} from "./state/todolists-reducer";
import {AddTaskAC, ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC, tasksReducer} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TodolistWithRedux} from "./TodolistWithRedux";
import {TodolistWithRedux1} from "./TodolistWithRedux1";


export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function AppWithReducer() {

    let todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists);
    // let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    let dispatch = useDispatch();

    console.log(todolists)

    // let [todolists, disptchToTodolists] = useReducer<Reducer<Array<TodolistType>, TodolistsActionsType>>(todolistsReducer,[
    //     {id: todolistId1, title: "What to learn", filter: "all"},
    //     {id: todolistId2, title: "What to buy", filter: "all"}
    // ])

    // let [tasks, disptchToTasks] = useReducer(tasksReducer,{
    //     [todolistId1]: [
    //         {id: v1(), title: "HTML&CSS", isDone: true},
    //         {id: v1(), title: "JS", isDone: true}
    //     ],
    //     [todolistId2]: [
    //         {id: v1(), title: "Milk", isDone: true},
    //         {id: v1(), title: "React Book", isDone: true}
    //     ]
    // });

    function removeTask(id: string, todolistId: string) {
        dispatch(RemoveTaskAC(id,todolistId));
    }

    function addTask(title: string, todolistId: string) {
        dispatch(AddTaskAC(title,todolistId));
    }

    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        dispatch(ChangeTaskStatusAC(id, isDone,todolistId));
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        dispatch(ChangeTaskTitleAC(id, newTitle, todolistId));
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatch(ChangeTodolistFilterAC(todolistId, value ))
    }

    function removeTodolist(id: string) {
        dispatch(RemoveTodolistAC(id))

    }

    function changeTodolistTitle(id: string, title: string) {
        dispatch(ChangeTodolistTitleAC(id, title))
    }

    function addTodolist(title: string) {
        dispatch(AddTodolistAC(title));//доб. пустую таску с id из AddTodolistAC
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {

                            return <Grid key={tl.id} item>
                                <Paper style={{padding: "10px"}}>
                                    <TodolistWithRedux1
                                        todolist={tl}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducer;
