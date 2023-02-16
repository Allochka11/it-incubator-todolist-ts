import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Task} from "../Task";
import {action} from "@storybook/addon-actions";

export default {
    title: 'TODOLISTS/Task',
    component: Task,
    args: {
        task: {id: '111', isDone: true, title: 'JS'},
        todolistId: 'lalla',
        changeTaskStatus: action('changeTaskStatus'),
        changeTaskTitle: action('changeTaskTitle'),
        removeTask: action('removeTask')
    }
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskDoneStory = Template.bind({});
export const TaskIsNotDoneStory = Template.bind({});

TaskIsNotDoneStory.args = {
    task: {id: '111', isDone: false, title: 'JS'},
}

const Template1: ComponentStory<typeof Task> = (args) => {
    const [task, setTask] = useState({id: '111', isDone: false, title: 'JS'});
    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean, todolistId: string) => {
        setTask({...task, isDone: newIsDoneValue})
    }

    const changeTaskTitle = (taskId: string, title: string, todolistId: string) => {
        setTask({...task, title: title})
    }


    return <Task
        changeTaskStatus={changeTaskStatus}
        changeTaskTitle={changeTaskTitle}
        removeTask={action('Removed task')}
        task={task}
        todolistId={'111'}
    />
};

export const WorkingTaskStory = Template1.bind({});





