const {myReadFile} = require('./my-read-file');

// const callback = text => {
//     console.log(text);
//     console.log('done');
// };
// myReadFile(callback);

myReadFile(text => {
    console.log(text);
    console.log('done');
});


// написать функцию
replaceName('template.txt', 'result.txt', 'Vasia');
// создает файл result, в который кладет содержимое файла
// 'template.txt' с {username} замененным на 'Vasia'

// 1. считать содержимое файла из параметра 1
// 2. заменить {username} на параметра 3
// 3. сохранить результат в файл из параметра 2

//writetofile

