import {TasksStateType} from '../App';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppActionTypes, AppRootStateType, AppThunkType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    todolistId: string
    newTask: TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

export type TaskActionTypes = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType | ReturnType<typeof setTasksAC>

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionTypes): TasksStateType => {
    switch (action.type) {
        case "SET_TODOLISTS": {
            let copyState = {...state}
            action.todolists.map(el => {
                copyState[el.id] = []
            })
            return copyState
        }
        case "SET_TASKS": {
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        }


        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            return {
                ...state,
                [action.todolistId]: [action.newTask, ...state[action.todolistId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (newTask: TaskType, todolistId: string): AddTaskActionType => {
    return {type: 'ADD-TASK', newTask, todolistId}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}

export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
    return {type: 'SET_TASKS', tasks, todolistId} as const
}

export const removeTaskTC = (todolistId: string, taskId: string):AppThunkType => {
    return (dispatch) => {
        todolistsAPI.deleteTask(todolistId, taskId).then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
            }
        })
    }
}
export const getTasksTC = (todolistId: string):AppThunkType => {
    return (dispatch) => {
        todolistsAPI.getTasks(todolistId).then(res => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
    }
}

export const createTaskTC = (title: string, todolistId: string):AppThunkType => {
    return (dispatch) => {
        todolistsAPI.createTask(todolistId, title).then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item, todolistId))
            }
        })
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, status: TaskStatuses):AppThunkType => {
    return (dispatch, getState: () => AppRootStateType) => {
        let task = getState().tasks[todolistId].find(t => t.id === taskId);

        if (task) {
            let model: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                status
            }
            todolistsAPI.updateTask(todolistId, taskId, model).then(res => {
                    dispatch(changeTaskStatusAC(taskId, status, todolistId))
            })
        }
    }
}
export const changeTaskTitleTC = (taskId: string, newTitle: string, todolistId: string):AppThunkType => {
    return (dispatch, getState:()=>AppRootStateType) => {
        debugger
        let task = getState().tasks[todolistId].find(t=>t.id === taskId)
        if(task) {
            let model: UpdateTaskModelType = {
                title:newTitle,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                status: task.status
            }

            todolistsAPI.updateTask(todolistId,taskId, model).then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskTitleAC(taskId, newTitle,todolistId))
                }
            })
        }
    }
}
