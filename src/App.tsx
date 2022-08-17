import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";

type TodolistsType = {
    id: string,
    title: string,
    filter: FilterValuesType
}



type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

type TasksType = {
    [key: string]: TaskType[]
}

function App() {


    let todolistID1 = v1()
    let todolistID2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TasksType>({
        [todolistID1]: [ //el.id
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},

        ],
        [todolistID2]: [ //el.id
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    })

    // let [todolists, setTodolists] = useState<Array<TodolistsType>>(
    //     [
    //         {id: v1(), title: 'What to learn', filter: 'all'},
    //         {id: v1(), title: 'What to buy', filter: 'all'},
    //     ]
    // )
    //
    // let [tasks, setTasks] = useState([
    //     {id: v1(), title: "HTML&CSS", isDone: true},
    //     {id: v1(), title: "JS", isDone: true},
    //     {id: v1(), title: "ReactJS", isDone: false},
    //     {id: v1(), title: "Rest API", isDone: false},
    //     {id: v1(), title: "GraphQL", isDone: false},
    // ]);
    // let [filter, setFilter] = useState<FilterValuesType>("all");


    function removeTask(todolistId:string,taskId: string) {
        setTasks({...tasks,[todolistId] : tasks[todolistId].filter(el=> el.id !== taskId)})

    }

    function addTask(todolistId:string, title: string) {
        let newTask = {id: v1(), title: title, isDone: false};
        setTasks({...tasks,[todolistId]: [newTask,...tasks[todolistId]]})
    }

    function changeStatus(todolistId:string, taskId: string, isDone: boolean) {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(el=> el.id === taskId ? {...el, isDone: isDone} :el)})
    }


    // let tasksForTodolist = tasks;
    //
    //
    // if (todolists[0].filter === "active") {
    //     tasksForTodolist = tasks.filter(t => t.isDone === false);
    // }
    // if (filter === "completed") {
    //     tasksForTodolist = tasks.filter(t => t.isDone === true);
    // }

    function changeFilter(todolistId:string,value: FilterValuesType) {
        setTodolists(todolists.map(el=>el.id === todolistId ? {...el, filter: value} : el))

    }
    const removeTodolist = (todolistId:string) => {
        setTodolists(todolists.filter(el => el.id !== todolistId ));
        delete tasks[todolistId]
    }


    return (
        <div className="App">
            {todolists.map(el => {

                let tasksForTodolist = tasks[el.id];

                if (el.filter === "active") {
                    tasksForTodolist = tasks[el.id].filter(t => t.isDone === false);
                }
                if (el.filter === "completed") {
                    tasksForTodolist = tasks[el.id].filter(t => t.isDone === true);
                }


                return (
                    <Todolist
                        key={el.id}
                        todolistId={el.id}
                        title={el.title}
                              tasks={tasksForTodolist}
                              removeTask={removeTask}
                              changeFilter={changeFilter}
                              addTask={addTask}
                              changeTaskStatus={changeStatus}
                              filter={el.filter}
                        removeTodolist={removeTodolist}
                    />
                )
            })}

        </div>
    );
}

export default App;
