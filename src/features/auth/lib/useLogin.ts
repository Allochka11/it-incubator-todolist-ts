import { useSelector } from "react-redux";
import { isLoggedInSelector } from "app/app.selector";
import { FormikHelpers, useFormik } from "formik";
import { LoginParamsType } from "features/auth/api/auth.api";
import { authThunks } from "features/auth/model/auth-reducer";
import { BaseResponseType } from "common/api";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type FormikErrorType = Partial<Omit<LoginParamsType, "captcha">>;
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {};

      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required password";
      } else if (values.password.length < 8) {
        errors.password = "Invalid password";
      }
      return errors;
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .then((res) => {})
        .catch((err: BaseResponseType) => {
          err.fieldsErrors?.forEach((e) => {
            formikHelpers.setFieldError(e.field, e.error);
          });
        });
    },
  });
  return { formik, isLoggedIn };
};
