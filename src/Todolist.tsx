import React, {useState} from "react";
import {FilterValuesType} from './App';

export type InArrayProps = {
    id: number,
    title: string,
    isDone: boolean
}

type TodoListPropsType = {
    title: string,
    tasks: Array<InArrayProps>
    removeTask : (taskId:number) => void
}


export const Todolist = (props: TodoListPropsType) => {

    const [filter, setFilter] = useState<FilterValuesType>('All');

        let tasksForRender;
        switch (filter){
            case 'Active':
                tasksForRender = props.tasks.filter(task=> !task.isDone)
                    break;
            case 'Completed':
                tasksForRender = props.tasks.filter(task=> task.isDone)
                break
            default:
                tasksForRender = props.tasks

        }
        const changeFilter = (filter:FilterValuesType) => {
            setFilter(filter)
        }




    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>

                {tasksForRender.map((el) => {

                    return (
                        <li key={el.id}>
                            <button onClick={()=>{props.removeTask(el.id)}}>X</button>
                            <input type="checkbox" checked={el.isDone}/>
                            <span>{el.title}</span>
                        </li>)
                })}
            </ul>
            <div>
                <button onClick={()=>{changeFilter('All')}}>All</button>
                <button onClick={()=>{changeFilter('Active')}}>Active</button>
                <button onClick={()=>{changeFilter('Completed')}}>Completed</button>
            </div>
        </div>
    )
}
