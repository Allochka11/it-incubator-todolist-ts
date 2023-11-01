import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { authAPI, LoginParamsType } from "features/auth/api/auth.api";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils";

const initialState: InitialStateType = {
  isLoggedIn: false,
};
const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(authThunks.initializeApp.fulfilled, authThunks.login.fulfilled, authThunks.logout.fulfilled),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      },
    );
  },
});

// actions

export const authReducer = slice.reducer;

// thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("auth/login", async (args, thunkAPI) => {
  let { dispatch, rejectWithValue } = thunkAPI;

  dispatch(appActions.setAppStatus({ status: "loading" }));
  return thunkTryCatch(thunkAPI, async () => {
    let res = await authAPI.login(args);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else if (res.data.resultCode === 10) {
      handleServerAppError(res.data, dispatch, true);
      return rejectWithValue(null);
    } else {
      let isShowAppError = !res.data.fieldsErrors.length;
      handleServerAppError(res.data, dispatch, isShowAppError);
      return rejectWithValue(res.data);
    }
  });
});

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
        handleServerAppError(res.data, dispatch);
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
