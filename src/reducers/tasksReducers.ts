import {v1} from "uuid";
import {FilterValuesType, TasksStateType} from "../App";
import {addTodolistAC} from "./todolistReducers";

export const tasksReducers = (state: TasksStateType, action: tsarType) => {
    switch (action.type) {
        case "REMOVE-TASK": {
            let todolistTasks = state[action.payload.todolistId];
            state[action.payload.todolistId] = todolistTasks.filter(t => t.id !== action.payload.id);
            return {...state}
        }
        case "ADD-TASK": {
            let task = {id: v1(), title: action.payload.title, isDone: false};
            let todolistTasks = state[action.payload.todolistId];
            state[action.payload.todolistId] = [task, ...todolistTasks];
            return {...state}
        }
        case "UPDATE-TASK": {
            return {...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    title: action.payload.newTitle
                } : t)
            }
        }
        case "CHANGE-STATUS-TASK": {
            //достанем нужный массив по todolistId:
            let todolistTasks = state[action.payload.todolistId];
            // // найдём нужную таску:
            let task = todolistTasks.find(t => t.id === action.payload.id);
            // //изменим таску, если она нашлась
            if (task) {
                task.isDone = action.payload.isDone;
                // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
                return {...state};
            } else return state
        }
        case "ADD-TODOLIST" : {
            return {[action.payload.todolistId]: [], ...state}
        }
        // case "FILTER-TASK":{
        //
        //     if (action.payload.value === "active") {
        //         tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
        //     }
        //     if (tl.filter === "completed") {
        //         // tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
        //     }
        // }

        default:
            return state
    }
}

type tsarType = ReturnType<typeof removeTaskAC> |
    ReturnType<typeof addTaskAC> |
    ReturnType<typeof updateTaskAC> |
    ReturnType<typeof changeStatusTaskAC> |
    ReturnType<typeof addTodolistAC>
    // ReturnType<typeof filterTaskAC>

export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            id, todolistId
        }
    } as const
}
export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            title, todolistId
        }
    } as const
}
export const updateTaskAC = (todolistId: string, taskId: string, newTitle: string) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistId, taskId, newTitle
        }
    } as const
}
export const changeStatusTaskAC = (id: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'CHANGE-STATUS-TASK',
        payload: {
            id, isDone, todolistId
        }
    } as const
}

// export const filterTaskAC = (value: FilterValuesType, todolistId: string) => {
//     return {
//         type: 'FILTER-TASK',
//         payload: {
//             value, todolistId
//         }
//     } as const
// }
