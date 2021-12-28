// Колбэки
// const fs = require("fs");

// const replaceName = (templateFilePath, resultFilePath, name, callback) => {
//   fs.readFile(templateFilePath, function (error, templateData) {
//     if (error) throw error;
//     const templateDataString = templateData.toString();
//     //console.log("Содержимое template:", templateDataString);
//     const data = templateDataString.replace("{username}", name);

//     fs.writeFile(resultFilePath, data, function (error) {
//       if (error) throw error;
//       fs.readFile("./result.txt", function (error, resultData) {
//         if (error) throw error;
//         callback(templateDataString, resultData.toString());
//         //console.log("Содержимое result: ", resultData.toString());
//       });
//     });
//   });
// };

// module.exports = {
//   replaceName,
// };

// Промисы

const { readFile, writeFile } = require("fs/promises");

const replaceName = async (templateFilePath, resultFilePath, name) => {
  try {
    const template = (await readFile(templateFilePath)).toString();
    const newString = template.replace("{username}", name);
    await writeFile(resultFilePath, newString);
    const result = (await readFile("./result.txt")).toString();

    return ({template, result});
  } catch (err) {
    return {err};
  }
}

module.exports = {
  replaceName,
};
