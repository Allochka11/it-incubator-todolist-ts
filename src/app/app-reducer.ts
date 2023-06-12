//app-reducer.tsx
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialised: false // состояние приложения, есть ли данные, иначе - прелоадер
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppRequestActionTypes): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return  {...state, error: action.error}
        case 'APP/SET-IS-INITIALISED':
            return  {...state, isInitialised: action.value}
        default:
            return state
    }
}

export type AppRequestActionTypes =
    | ReturnType<typeof setRequestStatus>
    | ReturnType<typeof setRequestError>
    | ReturnType<typeof setIsInitialisedAC>


export const setRequestStatus = (status:RequestStatusType) =>({ type: 'APP/SET-STATUS', status} as const);
export const setRequestError = (error: string | null) =>({ type: 'APP/SET-ERROR', error} as const);

export const setIsInitialisedAC = (value:boolean) =>({type: 'APP/SET-IS-INITIALISED', value} as const)
