import {ActionType, div, mult, salaryReducer, StateType, sub, sum} from "./tasks";

test.skip ('sum of salary witn "n" bonus', ()=>{
    let salary: number = 800;
    let n : number = 200;
    let result = sum(salary, n);
    expect(result).toBe(1000 )
});

test.skip('sub of salary without "n" bonus', ()=>{
    expect(sub(1200, 200)).toBe(1000 )
});

test.skip('div of salary and "n" bonus', ()=>{
    expect(div(1200, 2)).toBe(600 )
});

test.skip('mult of salary and "n" bonus', ()=>{
    expect(mult(1200, 2)).toBe(2400 )
});

test('case SUM', ()=> {
    let salary: StateType = 800;
    let action: ActionType = {
        type:'SUM',
        n:200
    }

    let res = salaryReducer(salary, action);
    expect(res).toBe(1000)
})