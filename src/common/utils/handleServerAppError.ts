import { appActions } from "app/app-reducer";
import { BaseResponseType } from "common/api/baseApi";
import { Dispatch } from "redux";

/**
 * Handles errors received from the server and updates the application status.
 *
 * @template D - type of data contained in the server response
 * @param {BaseResponseType<D>} data - server response
 * @param {Dispatch} dispatch - Redux dispatch function for sending actions
 * @param {boolean} [showError=true] - flag indicating whether to show the error to the user
 */

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
