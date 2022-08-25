import React, {ChangeEvent, useState} from "react";

type EditableSpanType = {
    title:string
    callback:(newTitle:string)=>void
}

export const EditableSpan = (props: EditableSpanType) => {
    const {title, callback} = props

    const [edit, setEdit] = useState(false);
    let [newTitle, setNewTitle] = useState(title);

    const toggleHandler = () => {
        setEdit(!edit);
        addTask();
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    const addTask = () => {
        if (newTitle.trim() !== "") {
            callback(newTitle);
        }
    }

    return(
        edit
            ? <input type="text" value={newTitle} autoFocus onChange={onChangeHandler} onBlur={toggleHandler}/>
            : <span onDoubleClick={toggleHandler} >{props.title}</span>
    );
};
