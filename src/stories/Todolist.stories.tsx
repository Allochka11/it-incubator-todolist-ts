import {AddItemForm} from "../AddItemForm";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {TaskType, Todolist} from "../Todolist";
import {FilterValuesType} from "../App";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";
import AppWithRedux from "../AppWithRedux";
import React from "react";
import {action} from "@storybook/addon-actions";

export default {
    title: 'TODOLISTS/Todolist',
    component: Todolist,
    decorators:[ReduxStoreProviderDecorator]
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof Todolist> = (args) => <Todolist {...args}/>;


export const TodolistStory = Template.bind({});
TodolistStory.args = {
    id: '1',
    title: 'string',
    tasks: [{
        id: 'string',
        title: 'string',
        isDone: false
    }],
    changeFilter: () => action('changeFilter'),
    addTask: () => action('addTask'),

    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => action('changeTaskStatus'),
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => action('changeTaskTitle'),
    removeTask: (taskId: string, todolistId: string) => action('changeTaskTitle'),

    removeTodolist: (id: string) => action('removeTodolist'),
    changeTodolistTitle: (id: string, newTitle: string) => action('changeTodolistTitle'),
    filter: 'active'

}