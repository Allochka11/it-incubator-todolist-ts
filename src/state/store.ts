import {TaskActionTypes, tasksReducer} from './tasks-reducer';
import {TodolistActionTypes, todolistsReducer} from './todolists-reducer';
import {AnyAction, applyMiddleware, combineReducers, createStore, legacy_createStore} from 'redux';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;
// все типы екшенов всех редюсеров
export type AppActionTypes = TaskActionTypes | TodolistActionTypes;
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;


export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionTypes>;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;



