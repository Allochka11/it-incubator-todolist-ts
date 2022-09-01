import {FilterValuesType, TodolistType} from "../App";

export const todolistReducer = (state:TodolistType[], action:todolistACType) => {
    switch (action.type) {
        case  "ADD-TODOLIST": {
            const newTodolist:TodolistType = {id: action.payload.todolistId, title: action.payload.title, filter: "all"};
            return [newTodolist, ...state]
        }
        case "UPDATE-TODOLIST" : {
            return  state.map(t => t.id === action.payload.todolistId ? {...t, title: action.payload.newTitle} : t)

        }
        case "CHANGE-FILTER-TODOLIST" : {
            let todolist = state.find(tl => tl.id === action.payload.todolistId);
            if (todolist) {
                todolist.filter = action.payload.value;
                return [...state]
            } else return state

        }
        case "REMOVE-TODOLIST": {

            return state.filter(tl => tl.id !== action.payload.id)
        }
        default:return state
    }
}


type todolistACType = ReturnType<typeof addTodolistAC>|
    ReturnType<typeof updateTodolistAC>|
    ReturnType<typeof changeFilterTodolistAC>|
    ReturnType<typeof removeTodolistAC>

export const addTodolistAC = (title:string, todolistId:string) => {
    return {
        type: "ADD-TODOLIST",
        payload:{title, todolistId}
    } as const
}
export const updateTodolistAC = (todolistId: string, newTitle:string) => {
    return {
        type: "UPDATE-TODOLIST",
        payload:{todolistId, newTitle}
    } as const
}


export const changeFilterTodolistAC = (value: FilterValuesType, todolistId: string) => {
    return {
        type: "CHANGE-FILTER-TODOLIST",
        payload:{todolistId, value}
    } as const
}

export const removeTodolistAC = (id: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload:{id}
    } as const
}

