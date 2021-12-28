const {readFile} = require('fs'); // функция require возвращает модуль по имени или пути
// const fs = require('fs');
// const {readFile} =fs;
// const readFile =fs.readFile;


const myReadFile = (callback) => readFile('./fesf.txt', (err, data) => {
    if (err) throw err;
callback(data.toString());
    //console.log(data.toString());
});

module.exports = {
    myReadFile
};


//callback ф-я которая будет вызвана после завершения другой ф-и