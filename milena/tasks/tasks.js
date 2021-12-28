// 1. Моздать массив заполненный числами от 1 до 10
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 2. Написать функцию, которая возврщает массив, заполненный числами в указанном интервале,
//    например fillArray(1,5) => [1,2,3,4,5]
const fillArray = (start, end) => {
  let newArray = [];

  if (start <= end) {
    for (let i = start; i <= end; i++) {
      newArray.push(i);
    }
  } else if (start > end) {
    for (let i = start; i >= end; i--) {
      newArray.push(i);
    }
  } else {
    throw "Start or End point are undefined or NaN";
  }

  return newArray;
};

// 3. Найти сумму четных чисел в этом массиве(использовать методы filter и reduce)
const evenNumSum = (array) => {
  const evenNumArr = array.filter((num) => num % 2 === 0);
  const sumOfEvenNumbers = evenNumArr.reduce((total, num) => total + num);
  return sumOfEvenNumbers;
};

// 4. Написать функции, которые преобразуют объект в массив toPairs({a:1,b:2}) => [["a",1],["b",2]]
//и обратно fromPairs (НЕ использовать Object.entries, Object.fromEntries, использовать reduce)
//const obj = ({a:1,b:2});

const toPairs = (obj) =>
  Object.keys(obj).reduce((acc, key) => [...acc, [key, obj[key]]], []);

// const toPairs = (obj) => {
//   let arr = [];
//   for (let key in obj) {
//     arr.push([key, obj[key]]);
//   }

//   return arr;
// };

const fromPairs = (arr) =>
  arr.reduce(
    (acc, item) => ({
      ...acc,
      [item[0]]: item[1],
    }),
    {}
  );

// const fromPairs = (arr) => {
//   let obj = {};
//   for (let x in arr) {
//     obj = { ...obj, [arr[x][0]]: arr[x][1] };
//   }

//   return obj;
// };

// const fromPairs = (arr) => {
//   let obj = {};
//   for (let x in arr) {
//     let obj2 = { [arr[x][0]]: arr[x][1] };
//     Object.assign(obj, obj2);
//   }

//   return obj;
// };

//5. Написать фйнкцию, которая принимает строку вида "Петя ест кашу, Вася ест суп, Коша ест шебу",
//а на выходе получается объект {"Петя": "кашу", "Вася": "суп", "Коша": "Шебу"}

const strToObj = (str) =>
  str
    .split(",")
    .map((x) => x.trim().split(" "))
    .reduce(
      (acc, item) => ({
        ...acc,
        [item[0]]: item[2],
      }),
      {}
    );

// const strToObj = (str) =>
//   str
//     .split(",")
//     .map((x) => x.trim().split(" "))
//     .reduce(
//       (acc, [key, verb, value]) => ({
//         ...acc,
//         [key]: value,
//       }),
//       {}
//     );

module.exports = { fillArray, evenNumSum, toPairs, fromPairs, strToObj };


// Деструктуризация 
// const [name, verb, food] = "петя ест кашу".split(" ");

// "a:1,b:2,c:3"
//   .split(",")
//   .map((pair) => pair.split(":"))
//   .map(([key, value]) => ({ [key]: value }));
