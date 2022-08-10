import React, {ChangeEvent} from "react";

type CheckBoxType = {
    isDone:boolean
    callback:(isDoneCheckBox:boolean)=> void
}

export const CheckBox = (props: CheckBoxType) => {

    let onChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        props.callback(event.currentTarget.checked);
    };

    return(
        <input type="checkbox" checked={props.isDone} onChange={onChangeHandler}/>
    );
};