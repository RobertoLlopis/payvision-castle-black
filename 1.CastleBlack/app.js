const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const consola = require("consola");
const router = require("./src/router.js");
const api = require("./src/api.js");

const app = express();
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 8080;
app.set("port", port);

async function run() {
  //*This disable hides session and technical info
  //*If there is not particular advantage or need is good practice to hide
  app.disable("x-powered-by"); // QUESTION: any reason is this line here?
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/", router);
  app.use("/api", api);

  const server = http.createServer(app);

  server.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}

run();

module.exports = {
  run,
  app,
};
