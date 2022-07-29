import React, {useState} from 'react';
import './App.css';
import {InArrayProps, Todolist} from "./Todolist";

export type FilterValuesType = 'All' | 'Active' | 'Completed';

function App() {
// : Array<InArrayProps>

    let [tasks, setTasks] = useState <Array<InArrayProps>> (   [
        { id: 1, title: "HTML&CSS", isDone: true },
        { id: 2, title: "JS", isDone: true },
        { id: 3, title: "ReactJS", isDone: false },
        { id: 4, title: "ReactJS", isDone: false }
    ]);


    const removeTask = (taskId:number) => {
        setTasks(tasks.filter(task=> task.id !== taskId));
    }

    return (
        <div className="App">
            <Todolist title="What to learn"
                      tasks={tasks}
                      removeTask={removeTask}
            />
        </div>
    );
}

export default App;
