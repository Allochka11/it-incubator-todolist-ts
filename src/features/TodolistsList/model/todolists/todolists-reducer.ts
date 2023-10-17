import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils";
import { TodolistType } from "features/TodolistsList/api/todolists/todolist.types";
import { todolistsAPI } from "features/TodolistsList/api/todolists/todolists.api";

const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      let index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ todolistId: string; status: RequestStatusType }>) => {
      let index = state.findIndex((tl) => tl.id === action.payload.todolistId);
      if (index !== -1) state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsThunks.changeTodolistTitle.fulfilled, (state, action) => {
        let index = state.findIndex((tl) => tl.id === action.payload.id);
        if (index !== -1) state[index].title = action.payload.title;
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        let newTodolist = { ...action.payload.todolist, filter: "all", entityStatus: "idle" } as TodolistDomainType;
        state.unshift(newTodolist);
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        let index = state.findIndex((tl) => tl.id === action.payload.todolistId);
        if (index !== -1) {
          state.splice(index, 1);
        }
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return [];
      });
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

// thunks
const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  "todolists/fetchTodolists",
  async (arg, thunkAPI) => {
    let { dispatch, rejectWithValue } = thunkAPI;

    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let res = await todolistsAPI.getTodolists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));

      res.data.forEach((tl) => {
        dispatch(tasksThunks.fetchTasks(tl.id));
      });

      return { todolists: res.data };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  "todolists/removeTodolist",
  async (arg, thunkAPI) => {
    let { dispatch, rejectWithValue } = thunkAPI;
    let { todolistId } = arg;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: todolistId, status: "loading" }));
    try {
      let res = await todolistsAPI.deleteTodolist(todolistId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolistId: todolistId };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  "todolists/addTodolist",
  async (arg, thunkAPI) => {
    let { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      let res = await todolistsAPI.createTodolist(arg.title);
      if (res.data.resultCode === 0) {
        return { todolist: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  },
);

const _addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  "todolists/addTodolist",
  async (arg, thunkAPI) => {
    let { dispatch, rejectWithValue } = thunkAPI;
    let { title } = arg;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let res = await todolistsAPI.createTodolist(title);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolist: res.data.data.item };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  "todolists/changeTodolistTitle",
  async (arg, thunkAPI) => {
    let { dispatch, rejectWithValue } = thunkAPI;
    let { id, title } = arg;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      let res = await todolistsAPI.updateTodolist(id, title);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { id, title };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle };
