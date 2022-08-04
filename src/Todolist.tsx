import React, {ChangeEvent,KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import {Button} from './component/Button';

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    addTask: (inputValue:string) => void
    changeFilter: (value: FilterValuesType) => void
}

export function Todolist(props: PropsType) {
    const [inputValue,setInputValue] = useState('');

    const onChangeInputValue = (event:ChangeEvent<HTMLInputElement>) => {
        let newValue = event.currentTarget.value
        setInputValue(newValue)
    }
    const onKeyPressHandler = (event:KeyboardEvent<HTMLInputElement>)=> {
        if(event.key === 'Enter') {
            addTaskButtonHandler()
        }
    }

    const addTaskButtonHandler = () => {
        props.addTask(inputValue);
        setInputValue('');
    }

    const changeFilterHandler = (value:FilterValuesType) => {
        props.changeFilter(value)
    }

    const removeTaskHandler = (id:string)=> {
        props.removeTask(id)
    }

    return <div>
        <h3>{props.title}</h3>
        <div>
            <input onChange={onChangeInputValue}
                   onKeyDown={onKeyPressHandler}
                   value={inputValue}/>
            <Button name={'x'} callback={addTaskButtonHandler}/>
            {/*<button onClick={addTaskButtonHandler}>+</button>*/}
        </div>
        <ul>
            {
                props.tasks.map((t) => {

                   return (<li key={t.id}>
                        <input type="checkbox" checked={t.isDone}/>
                        <span>{t.title}</span>
                           <Button name={'X'} callback={()=>removeTaskHandler(t.id)}/>
                        {/*<button onClick={()=>removeTaskHandler(t.id)}>x*/}
                        {/*</button>*/}
                    </li>
                   )
                })
            }
        </ul>
        <div>
            <Button name={'All'} callback={()=>{changeFilterHandler('all')} }/>
            <Button name={'Active'} callback={()=>{changeFilterHandler('active')} }/>
            <Button name={'Completed'} callback={()=>{changeFilterHandler('completed')} }/>

        </div>
    </div>
}
