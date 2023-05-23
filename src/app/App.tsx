import React, {useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {setTodolistsTC} from '../features/TodolistList/todolists-reducer'
import {useAppDispatch, useAppSelector} from './store';
import {TaskType} from '../api/todolists-api'
import TodolistList from '../features/TodolistList/TodolistList';
import LinearProgress from "@mui/material/LinearProgress";
import ErrorSnackbar from "../components/ErrorSnackbar/ErrorSnackbar";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTodolistsTC())
    }, [])

    const status = useAppSelector(state => state.app.status)

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>
                <TodolistList/>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}
export default App;



