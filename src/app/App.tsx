import React, { useCallback, useEffect } from "react";
import "./App.css";
import { ErrorSnackbar } from "common/components";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Login } from "features/auth/ui/Login";
import { AppBar, Button, CircularProgress, Container, LinearProgress, Toolbar } from "@mui/material";
import { isInitializedSelector, isLoggedInSelector, statusSelector } from "app/app.selector";
import { TodolistsList } from "features/TodolistsList";
import { authThunks } from "features/auth/model/auth-reducer";

function App() {
  const status = useSelector(statusSelector);
  const isInitialized = useSelector(isInitializedSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(authThunks.initializeApp());
  }, []);

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout());
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
