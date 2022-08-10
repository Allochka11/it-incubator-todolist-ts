import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import s from '../src/Todolist.module.css';
import {CheckBox} from "./components/CheckBox";
type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
    changeIsDone: (id:string, isDone:boolean) => void
}

export function Todolist(props: PropsType) {

    let [title, setTitle] = useState("");
    const [error, setError] = useState<string|null>(null);
    const [filterValue, setFilterValue] = useState<FilterValuesType>('all')
    const [isDoneId, setIsDoneId] = useState<string>('')

    const addTask = () => {
        if(title.trim() !== '') {
            props.addTask(title.trim());
         }
        else {
            setError('Title is required')
        }
        setTitle("");
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        // setError(null)
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.charCode === 13) {

            addTask();
        }
    }
    const onAllClickHandler = () => {
        props.changeFilter("all")
        setFilterValue('all')
    };
    const onActiveClickHandler = () => {
        props.changeFilter("active")
        setFilterValue('active')
    } ;
    const onCompletedClickHandler = () => {
        props.changeFilter("completed")
        setFilterValue('completed')
    };
    const changeIsDoneHandler = (isDoneCheckBox:boolean, tId:string) => {
        props.changeIsDone(tId, isDoneCheckBox );
    }



    return <div>
        <h3>{props.title}</h3>
        <div>
            <input className={error ? s.error :''} value={title} onChange={ onChangeHandler } onKeyPress={ onKeyPressHandler }/>
            <button onClick={addTask}>+</button>
        </div>
        {error && <div className={s.error__message}>{error }</div>}
        <ul>
            {
                props.tasks.map(t => {

                    const onClickHandler = () => props.removeTask(t.id);


                    return <li key={t.id} className={t.isDone ? s.isDone : ''}>
                        <CheckBox isDone={t.isDone} callback={(isDoneCheckBox)=>changeIsDoneHandler(isDoneCheckBox,t.id)}/>
                        {/*<input type="checkbox" checked={t.isDone} onChange={changeIsDoneHandler}/>*/}
                        <span>{t.title}</span>
                        <button onClick={ onClickHandler }>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={filterValue === 'all' ? s.active__filter : ''} onClick={ onAllClickHandler }>All</button>
            <button className={filterValue === 'active' ? s.active__filter : ''} onClick={ onActiveClickHandler }>Active</button>
            <button className={filterValue === 'completed' ? s.active__filter : ''} onClick={ onCompletedClickHandler }>Completed</button>
        </div>
    </div>
}
