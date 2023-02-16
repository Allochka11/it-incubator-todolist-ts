import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {EditableSpan} from "../EditableSpan";
import {action} from "@storybook/addon-actions";


export default {
    title: 'TODOLISTS/EditableSpan',
    component: EditableSpan
} as ComponentMeta<typeof EditableSpan>;

const Tamplate: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args}/>

export const EditableSpanStory = Tamplate.bind({});

EditableSpanStory.args = {
    value:'aaa',
    onChange: action('Changed editable span')
}

const Tamplate1: ComponentStory<typeof EditableSpan> = (args) => {
    let [title, setTitle] = useState('aaaa');
    const onChange = (title:string) => {
        setTitle(title)
    }

    return <EditableSpan
        value={title}
        onChange={onChange}
        />
}

export const WorkingEditableSpanStory = Tamplate1.bind({})