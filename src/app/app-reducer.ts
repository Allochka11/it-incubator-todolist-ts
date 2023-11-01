import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer";

let initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

export type AppInitialStateType = typeof initialState;

const slice = createSlice({
  name: "app",
  initialState,
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
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(todolistsThunks.fetchTodolists), (state, action) => {
        state.status = "loading";
      })
      .addMatcher(isRejected, (state, action) => {
        state.status = "failed";
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.status = "idle";
      });
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
