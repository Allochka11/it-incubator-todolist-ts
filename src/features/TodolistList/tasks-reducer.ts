import {TasksStateType} from '../../app/App';
import {addTodolistAC, removeTodolistAC, setEntityStatusAC, setTodolistsAC} from './todolists-reducer';
import {
    ResultCode,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {AppRootStateType, AppThunkType} from "../../app/store";
import {setRequestError, setRequestStatus} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, {Axios, AxiosError} from "axios";

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
        case 'SET_TODOLISTS':
            let copyState = {...state}
            action.todolists.map(el => {
                copyState[el.id] = []
            })
            return copyState
        case 'UPDATE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId].map(t=> t.id === action.taskId ? {...t,...action.updatedTask} : t)}
        case 'SET_TASKS':
            return {...state, [action.todolistId]: action.tasks}
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [action.newTask, ...state[action.todolistId]]
        }
        // case 'CHANGE-TASK-STATUS': {
        //     let todolistTasks = state[action.todolistId];
        //     let newTasksArray = todolistTasks
        //         .map(t => t.id === action.taskId ? {...t, status: action.status} : t);
        //
        //     state[action.todolistId] = newTasksArray;
        //     return ({...state});
        // }
        // case 'CHANGE-TASK-TITLE': {
        //     let todolistTasks = state[action.todolistId];
        //     // найдём нужную таску:
        //     let newTasksArray = todolistTasks
        //         .map(t => t.id === action.taskId ? {...t, title: action.title} : t);
        //
        //     state[action.todolistId] = newTasksArray;
        //     return ({...state});
        // }
        case 'ADD-TODOLIST':
            return {...state, [action.id]: []}
        case 'REMOVE-TODOLIST': {

           const copyState = {...state}
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    taskId,
    todolistId
} as const);
export const addTaskAC = (newTask: TaskType, todolistId: string) => ({type: 'ADD-TASK', newTask, todolistId} as const);
export const updateTaskAC = (taskId: string, updatedTask: UpdateTaskModelType, todolistId: string) => ({
    type: 'UPDATE_TASK',
    updatedTask,
    todolistId,
    taskId
} as const);

export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({type: 'SET_TASKS', tasks, todolistId} as const);

// thunks
export const removeTaskTC = (todolistId: string, taskId: string): AppThunkType => async dispatch => {
    try {
        dispatch(setRequestStatus('loading'));
        dispatch(setEntityStatusAC(todolistId, 'loading'))
        const res = await todolistsAPI.deleteTask(todolistId, taskId);
       if(res.data.resultCode === ResultCode.OK) {
           dispatch(removeTaskAC(taskId, todolistId))
           dispatch(setRequestStatus('succeeded'));
       } else {
           handleServerAppError(dispatch, res.data)
           dispatch(setEntityStatusAC(todolistId, 'failed'))
       }

    } catch (e) {
        if(axios.isAxiosError(e)){
            handleServerNetworkError(dispatch,e.message)
        }
    }
}


export const getTasksTC = (todolistId: string): AppThunkType =>
    (dispatch) => {
        dispatch(setRequestStatus('loading'));
        todolistsAPI.getTasks(todolistId).then(res => {
            if(res.data.items.length){
                dispatch(setTasksAC(res.data.items, todolistId))
                dispatch(setRequestStatus('succeeded'))
            } else{
                // dispatch(setRequestError('There is no tasks in todo'))
                dispatch(setRequestStatus('idle'))
            }
        })
            .catch(e => {
                handleServerNetworkError(dispatch, e.message)
            })
    }
export const addTaskTC = (title: string, todolistId: string): AppThunkType =>
    (dispatch) => {
        dispatch(setRequestStatus('loading'))
        todolistsAPI.createTask(todolistId, title).then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTaskAC(res.data.data.item, todolistId));
                dispatch(setRequestStatus('succeeded'));
            } else {
                handleServerAppError(dispatch,res.data)
            }
        })
            .catch((e)=> {
                handleServerNetworkError(dispatch, e.message)
            })
    }
type UpdateTaskStatusTitleType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export const updateTaskStatusTitleTC = (todolistId: string, taskId: string, domain: UpdateTaskStatusTitleType): AppThunkType =>
    async (dispatch, getState: () => AppRootStateType) => {
        let task = getState().tasks[todolistId].find(t => t.id === taskId);

        if (!task) return

        let apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            status: task.status,
            ...domain
        }
        dispatch(setRequestStatus('loading'));

        try {
            const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel);
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(updateTaskAC(taskId, apiModel, todolistId))
                dispatch(setRequestStatus('succeeded'));
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            if(axios.isAxiosError(e)) {
                handleServerNetworkError(dispatch, e.message)
            } else {
                handleServerNetworkError(dispatch, 'Some error with network')
            }

        }
    }

//types
export type TaskActionTypes =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>
