import {ResultCode, todolistsAPI, TodolistType} from '../../api/todolists-api'
import {AppThunkType} from '../../app/store';
import {RequestStatusType, setRequestStatus} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {getTasksTC} from "./tasks-reducer";

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionTypes): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET_TODOLISTS":
            return action.todolists.map(el => {
                return {...el, filter: "all", entityStatus: "idle"}
            })
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{
                id: action.id,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0, entityStatus: "idle"
            }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(t=> t.id === action.id ? {...t, title:action.title} : t)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(t=>t.id === action.id ? {...t, filter:action.filter} : t)
        case "SET_ENTITY_STATUS":
            return state.map(tl=> tl.id === action.id ? {...tl, entityStatus: action.entityStatus } : tl)
        case "CLEAR_TODOS_DATA":
            return []
        default:
            return state;
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const);
export const addTodolistAC = (title: string, id: string) => ({type: 'ADD-TODOLIST', title, id} as const);
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id: id,
    filter
} as const);
export const setTodolistsAC = (todolists: TodolistType[]) => ({type: 'SET_TODOLISTS', todolists} as const);
export const setEntityStatusAC = (id: string, entityStatus:RequestStatusType) => ({type: 'SET_ENTITY_STATUS', entityStatus, id} as const);
export const clearTodosDataAC = () =>({type:'CLEAR_TODOS_DATA'} as const)

// thunks
export const setTodolistsTC = (): AppThunkType => (dispatch) => {
    dispatch(setRequestStatus('loading'))
    todolistsAPI.getTodolists().then((res) => {
        if(res.data) {
            dispatch(setTodolistsAC(res.data));
            dispatch(setRequestStatus('succeeded'));
            return res.data
        }
    })
        .then(todos =>{
            todos?.forEach((todo)=>{
                dispatch(getTasksTC(todo.id))
            })

        })
        .catch(e =>{
            handleServerNetworkError(dispatch,e.message)
        })
}
export const createTodolistTC = (title: string): AppThunkType =>
    (dispatch) => {
        dispatch(setRequestStatus('loading'))
        todolistsAPI.createTodolist(title).then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTodolistAC(title, res.data.data.item.id))
                // dispatch(setRequestStatus('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
            .catch(e =>{
                handleServerNetworkError(dispatch, e.message)
            })
    }


type ErrorBackendType = {
    field:string,
    message:string
}
export const removeTodolistTC = (todolistId: string): AppThunkType =>
    (dispatch) => {
        dispatch(setRequestStatus('loading'));
        dispatch(setEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId).then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTodolistAC(todolistId));
                dispatch(setRequestStatus('succeeded'));
            } else{
                handleServerAppError(dispatch, res.data)
            }
        })
            .catch((e:AxiosError<ErrorBackendType>) =>{
                debugger
                const errorMessage = e.response ? e.response?.data.message : e.message;
                //network error
                dispatch(setEntityStatusAC(todolistId, 'failed'))
                handleServerNetworkError(dispatch, errorMessage)
            })
    }
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunkType =>
    (dispatch) => {
        dispatch(setRequestStatus('loading'))
        todolistsAPI.updateTodolist(todolistId, title).then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setRequestStatus('succeeded'))
            }else{
                handleServerAppError(dispatch, res.data)
            }
        })
            .catch((e) =>{
                //network error
                handleServerNetworkError(dispatch, e.message)
            })

    }

// types
export type TodolistActionTypes =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setEntityStatusAC>
    | ReturnType<typeof clearTodosDataAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

