// import { setAppStatusAC } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { authAPI, LoginParamsType } from "features/auth/api/auth.api";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";

const initialState: InitialStateType = {
  isLoggedIn: false,
};
const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });

    builder.addCase(initializeApp.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

// actions

export const authReducer = slice.reducer;

// thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  "auth/login",
  async (args, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let res = await authAPI.login(args);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        //common reducer for tasks & todolists
        dispatch(clearTasksAndTodolists());
        return { isLoggedIn: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/initializeApp",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let res = await authAPI.me();
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        // handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppInitialized({ isInitialized: true }));
    }
  },
);

type InitialStateType = {
  isLoggedIn: boolean;
};

export const authThunks = { login, logout, initializeApp };
