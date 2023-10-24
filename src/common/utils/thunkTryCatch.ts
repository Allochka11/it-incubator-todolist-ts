import { AppDispatch, AppRootStateType } from "app/store";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { BaseResponseType } from "common/api";

/**
 * Оборачивает логику Thunk в блок try-catch, обрабатывает ошибки сети и управляет состоянием приложения.
 *
 * @template T - Тип возвращаемого значения из функции logic
 * @param {BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null>} thunkAPI - Объект API для Thunk
 * @param {() => Promise<T>} logic - Функция, содержащая асинхронную логику Thunk
 * @returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} - Результат выполнения функции logic или объект с ошибкой
 */
export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
  logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
};
