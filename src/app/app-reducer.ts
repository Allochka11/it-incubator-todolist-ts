import { Dispatch } from "redux";
import { authAPI } from "api/todolists-api";
import { authActions } from "features/Login/auth-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};

const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

// actions

export const appReducer = slice.reducer;
export const appActions = slice.actions;

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType;
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null;
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean;
};

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    } else {
    }
    dispatch(appActions.setAppInitialized({ isInitialized: true }));
  });
};

export type SetAppErrorActionType = ReturnType<typeof appActions.setAppError>;
export type SetAppStatusActionType = ReturnType<typeof appActions.setAppStatus>;
