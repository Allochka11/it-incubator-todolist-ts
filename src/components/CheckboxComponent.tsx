import React, {ChangeEvent} from "react";
import {Checkbox} from "@mui/material";

type CheckboxComponentType = {
    callback: (checked: boolean)=> void;
    checked: boolean
}

export const CheckboxComponentMemo = (props: CheckboxComponentType) => {
    const {callback, checked} = props;
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        callback(e.currentTarget.checked);
    }

    return(
        <Checkbox style={{color: 'pink'}} onChange={onChangeHandler} checked={checked}/>
    );
};


export const CheckboxComponent = React.memo(CheckboxComponentMemo)
