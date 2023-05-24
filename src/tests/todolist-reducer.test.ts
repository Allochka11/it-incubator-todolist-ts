import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistsAC,
    TodolistDomainType,
    todolistsReducer
} from "../features/TodolistList/todolists-reducer";


let startState:Array<TodolistDomainType>;
beforeEach(()=>{
    startState = [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'}
    ]
});

test('test of removing todolist from state', () => {

    let endState = todolistsReducer(startState, removeTodolistAC("todolistId1"))
    expect(endState).toHaveLength(1);
    expect(endState[0].id).toBe('todolistId2')
});
test('test of adding todolist to state', () => {
    let newTodolistTitle = 'New Title';

    let endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle,'3'))
    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[0].id).toBe('3');
})
test('todolist should be change its title', () => {
    let newTodolistTitle = 'New Title';

    let endState = todolistsReducer(startState, changeTodolistTitleAC('todolistId1', newTodolistTitle))
    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[1].title).toBe('What to buy');
})
test('todolist should be change its filter', () => {

    let endState = todolistsReducer(startState, changeTodolistFilterAC('todolistId1', 'completed'))
    expect(endState[0].filter).toBe('completed');
    expect(endState[1].filter).toBe('all');
})

test('todolist should be setted to state', () => {
    let newState = [
        {id: 'todolistId3', title: 'What to eat', filter: 'all', addedDate: '', order: 0},
        {id: 'todolistId4', title: 'What to know', filter: 'all', addedDate: '', order: 0}
    ]

    let endState = todolistsReducer(startState, setTodolistsAC(newState))
    expect(endState).toHaveLength(2);
    expect(endState[0].id).toBe('todolistId3');
})
