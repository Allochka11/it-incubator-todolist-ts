import React from 'react';
import './App.css';
import Todolist, {TaskType} from "./Todolist";

function App() {

    let tasks1: TaskType[] = [
        {id: 1,title: "CSS",isDone: true},
        {id: 2,title: "HTML",isDone: true},
        {id: 3,title: "React",isDone: false}
    ]
    let tasks2: Array<TaskType> = [
        {id: 1,title: "Avengers",isDone: true},
        {id: 2,title: "Love you, Rosy",isDone: true},
        {id: 3,title: "Dear John",isDone: false}
    ]
    return (
        <div className="App">
            <Todolist title="What to learn" tasks={tasks1}/>
            <Todolist title="Movies" tasks={tasks2}/>
        </div>
    );
}

export default App;
