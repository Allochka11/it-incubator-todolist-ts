import React, {useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {setTodolistsTC} from '../features/TodolistList/todolists-reducer'
import {useAppDispatch, useAppSelector} from './store';
import {TaskType} from '../api/todolists-api'
import TodolistList from '../features/TodolistList/TodolistList';
import LinearProgress from "@mui/material/LinearProgress";
import ErrorSnackbar from "../components/ErrorSnackbar/ErrorSnackbar";
import {RequestStatusType} from "./app-reducer";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {Error} from "../features/Error/Error";
import {Avatar} from "@mui/material";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setTodolistsTC())
    }, []);


    const status = useAppSelector<RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <AppBar position="static" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Toolbar>
                    {/*<IconButton edge="start" color="inherit" aria-label="menu">*/}
                    {/*    <Menu/>*/}
                    {/*</IconButton>*/}

                    <Button color="inherit">Login</Button>
                    <Button color="inherit">Logout</Button>

                </Toolbar>
                <Avatar
                    alt="Remy Sharp"
                    src=""
                    sx={{ width: 56, height: 56 }}
                    style={{ margin: '4px 10px 0 0px'}}
                />

            </AppBar>
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>

                    <Routes>
                        <Route path={'/'} element={ <TodolistList/>}/>
                        <Route path={'/login'} element={ <Login/>}/>
                        <Route path={'/404'} element={ <Error/>}/>
                        <Route path="/login/*" element={<Navigate to="/login" replace />} />
                        <Route path="*" element={<Navigate to="/404"  />} />
                    </Routes>


                {/*<Error/>*/}
            </Container>
            <ErrorSnackbar/>

        </div>
    );
}
export default App;



