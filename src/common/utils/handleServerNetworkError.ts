import { AppDispatch } from "app/store";
import axios, { AxiosError } from "axios";
import { appActions } from "app/app-reducer";

export const handleServerNetworkError = (e: unknown, dispatch: AppDispatch) => {
  let err = e as Error | AxiosError<{ e: string }>;
  if (axios.isAxiosError(err)) {
    let errorMessage = err.message ? err?.response?.data.message : "Some error occurred";
    dispatch(appActions.setAppError({ error: errorMessage }));
  } else {
    dispatch(appActions.setAppError({ error: `Native error ${err.message} ` }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
