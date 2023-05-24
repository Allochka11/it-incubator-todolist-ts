import {setRequestError, setRequestStatus} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

//error offline
export const handleServerNetworkError = (dispatch:Dispatch<ErrorUtilsDispatchType>, errorMessage: string) => {
    dispatch(setRequestError(errorMessage))
    dispatch(setRequestStatus('failed'));
}

//error from server online
export const handleServerAppError = <T>(dispatch:Dispatch<ErrorUtilsDispatchType>, data:ResponseType<T>) => {
    if( data.messages.length) {
        dispatch(setRequestError(data.messages[0]));
    } else {
        dispatch(setRequestError('Some error occurred'));
    } 
    dispatch(setRequestStatus('failed'))
}
type ErrorUtilsDispatchType =  | ReturnType<typeof setRequestStatus>
    | ReturnType<typeof setRequestError>
