import {AppThunkDispatch} from "../../app/store";
import {setIsInitialisedAC, setRequestStatus} from "../../app/app-reducer";
import {authAPI, LoginParamsType, ResultCode} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {clearTodosDataAC} from "../TodolistList/todolists-reducer";

const initialState = {
    isLoggedIn: false

}

type InitialStateType = typeof initialState
export const authReducer = (state:InitialStateType = initialState, action: AuthActionTypes) => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN' :
        return  {...state, isLoggedIn: action.value}

        default:
            return state

    }
    
}

export const setIsLoggedInAC = (value:boolean) =>({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const loginTC = (data:LoginParamsType) =>
    async (dispatch: AppThunkDispatch) => {
        try{
            dispatch(setRequestStatus('loading'));
            const res = await authAPI.login(data);
            if(res.data.resultCode === ResultCode.OK){
                console.log(res.data.data.userId)
                dispatch(setIsLoggedInAC(true))
                dispatch(setRequestStatus('succeeded'))
            } else{
                handleServerAppError(dispatch, res.data)
                dispatch(setRequestStatus('idle'))
            }
        } catch (e){
            if(axios.isAxiosError(e)){
                handleServerNetworkError(dispatch,e.message)
            }
        }
}

export const logoutTC = () =>
    async (dispatch: AppThunkDispatch) => {
        try{
            dispatch(setRequestStatus('loading'));
            const res = await authAPI.logout();
            if(res.data.resultCode === ResultCode.OK){
                dispatch(setIsLoggedInAC(false));
                dispatch(setRequestStatus('succeeded'));
                dispatch(clearTodosDataAC());
            } else{
                handleServerAppError(dispatch, res.data)
                dispatch(setRequestStatus('idle'))
            }
        } catch (e){
            if(axios.isAxiosError(e)){
                handleServerNetworkError(dispatch,e.message)
            }
        }
    }

export const meTC = () =>
    async (dispatch: AppThunkDispatch) => {
        try{
            dispatch(setRequestStatus('loading'));
            const res = await authAPI.me();
            if(res.data.resultCode === ResultCode.OK){
                dispatch(setIsLoggedInAC(true))
                dispatch(setRequestStatus('succeeded'))
            } else{
                handleServerAppError(dispatch, res.data)
                dispatch(setRequestStatus('idle'))
            }
        } catch (e){
            if(axios.isAxiosError(e)){
                handleServerNetworkError(dispatch,e.message)
            }
        } finally {
            dispatch(setIsInitialisedAC(true))
        }
    }




export type AuthActionTypes = ReturnType<typeof setIsLoggedInAC> | ReturnType<typeof setIsInitialisedAC>