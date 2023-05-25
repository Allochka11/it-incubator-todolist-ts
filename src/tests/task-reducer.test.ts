import {TasksStateType} from "../app/App";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from "../features/TodolistList/tasks-reducer";
import {RequestStatusType} from "../app/app-reducer";


let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low , entityStatus:"idle"
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus:"idle"
            },
            {
                id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus:"idle"
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus:"idle"
            },
            {
                id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus:"idle"
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus:"idle"
            }
        ]
    }
});

test('test of removing task from state', () => {
    let endState = tasksReducer(startState, removeTaskAC("1", "todolistId1"))

    expect(endState['todolistId1'].length).toBe(2);
    expect(endState['todolistId1'][0].title).toBe("JS");

});
test('test of update task title', () => {
    let newTitle = 'New Title';
    let domain = {
        title: newTitle,
        description: '',
        priority: TaskPriorities.Middle,
        startDate: 'task.startDate',
        deadline: 'task.deadline',
        status: TaskStatuses.New,
    }
    let endState = tasksReducer(startState, updateTaskAC("1", domain,'todolistId2'))

    expect(endState['todolistId2'].length).toBe(3);
    expect(endState['todolistId2'][0].title).toBe(newTitle);

});
test('test of update task status', () => {
    let domain = {
        title: 'bread',
        description: '',
        priority: TaskPriorities.Middle,
        startDate: 'task.startDate',
        deadline: 'task.deadline',
        status: TaskStatuses.New,
    }
    let endState = tasksReducer(startState, updateTaskAC("1", domain,'todolistId2'))

    expect(endState['todolistId2'].length).toBe(3);
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);

});
// test('test of adding task from state', () => {
//     let newTask = {
//         title: 'How to eat',
//         addedDate: "2023-03-17T15:07:19.68",
//         deadline: '',
//         description: 'null',
//         id: "6d2e1e50-0486-49e3-a4a9-1c717544277b",
//         order: -10,
//         priority: 1,
//         startDate: 'null',
//         status: 0,
//         todoListId: "041d07ba-59c9-4e88-bff9-cae726d8954f",
//         entityStatus: 'idle'
//     }
//     let endState = tasksReducer(startState, addTaskAC(newTask, "todolistId1"))
//
//     expect(endState['todolistId1'].length).toBe(4);
//     expect(endState['todolistId1'][0].title).toBe("How to eat");
//
// });