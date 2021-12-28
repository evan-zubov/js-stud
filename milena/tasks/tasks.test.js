// const {sum, div} = require('./tasks');

// test('1 + 2 = 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });

// describe('div', () => {
//     it('returns 0.5 if arguments are 1 and 2', () => {
//         expect(div(1, 2)).toBe(0.5);
//     });
//     it('throws exception if second argument is 0', () => {
//         expect(() => div(1, 0)).toThrow("devision by zero");
//     });
// });


const {fillArray, evenNumSum, toPairs, fromPairs, strToObj} = require('./tasks');

describe('fillArray', () => {
    it('returns [1,2,3,4,5] if arguments are 1 and 5', () => {
        expect(fillArray(1, 5)).toEqual([1,2,3,4,5]);
    });
    it('returns [7,6,5,4,3] if arguments are 7 and 3', () => {
        expect(fillArray(7, 3)).toEqual([7,6,5,4,3]);
    });
    it('returns [-1,0,1,2,3,4] if arguments are -1 and 4', () => {
        expect(fillArray(-1, 4)).toEqual([-1,0,1,2,3,4]);
    });
    it('throws error', () => {
        expect(() => fillArray(15)).toThrow();
    });
    it('throws error', () => {
        expect(() => fillArray()).toThrow();
    });
});

describe('evenNumSum', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    it('returns 30 if argument is array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', () => {
        expect(evenNumSum(array)).toBe(30);
    });
});

describe('toPairs', () => {
    it('returns array of arrays [["a",1],["b",2]] if argument is an object {a:1,b:2}', () => {
        expect(toPairs({a:1,b:2})).toEqual([["a",1],["b",2]]);
    });
});

describe('fromPairs', () => {
    it('returns an object {a:1,b:2} if argument is an array of arrays [["a",1],["b",2]]', () => {
        expect(fromPairs([["a",1],["b",2]])).toEqual({a:1,b:2});
    });
});

describe('strToObj', () => {
    it('returns an object {"Петя": "кашу", "Вася": "суп", "Коша": "Шебу"} if argument is a '  
  + 'string "Петя ест кашу, Вася ест суп, Коша ест шебу"', () => {
        expect(strToObj("Петя ест кашу, Вася ест суп, Коша ест шебу"))
        .toEqual({"Петя": "кашу", "Вася": "суп", "Коша": "шебу"});
    });
});