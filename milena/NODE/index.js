const replace = require("./replace");

const templateFilePath = "./template.txt";
const resultFilePath = "./result.txt";
const name = "Vasya"; //process.argv[2];

// Колбэк
// const callback = (templateData, resultData) => {
//     console.log("Содержимое template:", templateData);
//     console.log("Содержимое result: ", resultData);
// };

// replace.replaceName(templateFilePath, resultFilePath, name, callback);

// Промисы

// async () => {
//   const {template, result }= await replace.replaceName(
//     templateFilePath,
//     resultFilePath,
//     name
//   );
//   if (err) {
//     console.log(err);
//   } else {
//     console.log({ template, result });
//   }
// };

const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(async (req, res) => {
  //res.statusCode = 200
  console.log(`Запрошенный адрес: ${req.url}`);
  res.setHeader('Content-Type', 'text/plain')
  //res.end('Hello World\n')

  const { template, result, err } = await replace.replaceName(
    templateFilePath,
    resultFilePath,
    name
  );
  if (err) {
    console.log(err);
    res.end(err);
  } else {
    console.log({template, result});
    res.end(JSON.stringify({ template, result }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
