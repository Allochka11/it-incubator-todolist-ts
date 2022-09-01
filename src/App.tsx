import React, {useReducer, useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./components/AddItemForm";
import {
    addTaskAC,
    changeStatusTaskAC,
    removeTaskAC,
    tasksReducers,
    updateTaskAC
} from "./reducers/tasksReducers";
import {
    addTodolistAC,
    changeFilterTodolistAC,
    removeTodolistAC,
    todolistReducer,
    updateTodolistAC
} from "./reducers/todolistReducers";
import {logDOM} from "@testing-library/react";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    // let [todolists, setTodolists] = useState<Array<TodolistType>>([
    //     {id: todolistId1, title: "What to learn", filter: "all"},
    //     {id: todolistId2, title: "What to buy", filter: "all"},
    // ])

    let [todolists, dispatchTodolists] = useReducer(todolistReducer,[
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ])

    let [tasks, dispatchTasks] = useReducer(tasksReducers,{
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React Book", isDone: true}
        ]
    });

    function removeTask(id: string, todolistId: string) {
        dispatchTasks(removeTaskAC(id,todolistId))
    }

    function addTask(title: string, todolistId: string) {
       dispatchTasks(addTaskAC(title, todolistId))
    }

    const addTodolist=(title:string) => {
        let newTodolistId = v1();
        const action = addTodolistAC(title, newTodolistId);
        dispatchTodolists(action)
        dispatchTasks(action)
    }

    const updateTask = (todolistId: string, taskId:string, newTitle:string ) => {
        dispatchTasks(updateTaskAC(todolistId,taskId,newTitle))
    }
    const updateTodolist = (todolistId: string, newTitle:string) => {
        dispatchTodolists(updateTodolistAC(todolistId,newTitle))
    }
    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        dispatchTasks(changeStatusTaskAC(id,isDone, todolistId))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
      dispatchTodolists(changeFilterTodolistAC(value,todolistId))
    }

    function removeTodolist(id: string) {
        console.log(id)
        dispatchTodolists(removeTodolistAC(id))
        console.log(tasks)
        delete tasks[id]
    }

    return (
        <div className="App">
            <AddItemForm callback={addTodolist}/>
            {
                todolists.map(tl => {

                    let allTodolistTasks = tasks[tl.id];
                    let tasksForTodolist = allTodolistTasks;


                    if (tl.filter === "active") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                    }
                    if (tl.filter === "completed") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
                    }

                    return <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        filter={tl.filter}
                        removeTodolist={removeTodolist}
                        updateTask={updateTask}
                        updateTodolist={updateTodolist}
                    />
                })
            }

        </div>
    );
}

export default App;
