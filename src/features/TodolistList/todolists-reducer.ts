import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {AppThunkType} from '../../app/store';

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionTypes): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET_TODOLISTS":
            return action.todolists.map(el => {
                return {...el, filter: "all"}
            })
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{
                id: action.id,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(t=> t.id === action.id ? {...t, title:action.title} : t)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(t=>t.id === action.id ? {...t, filter:action.filter} : t)
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

// thunks
export const setTodolistsTC = (): AppThunkType => (dispatch) => {
    todolistsAPI.getTodolists().then((res) => {
        dispatch(setTodolistsAC(res.data))
    })
}
export const createTodolistTC = (title: string): AppThunkType =>
    (dispatch) => {
        todolistsAPI.createTodolist(title).then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(title, res.data.data.item.id))
            }
        })
    }
export const removeTodolistTC = (todolistId: string): AppThunkType =>
    (dispatch) => {
        todolistsAPI.deleteTodolist(todolistId).then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
            }
        })
    }
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunkType =>
    (dispatch) => {
        todolistsAPI.updateTodolist(todolistId, title).then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(todolistId, title))
            }
        })
    }

// types
export type TodolistActionTypes =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

