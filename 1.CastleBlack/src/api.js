const { Router } = require("express");
const api = Router();
const { listAllObjects } = require("./controllers/object-controller");
const { listAllPlayers } = require("./Controllers/player-controller");
// This was my data source. I move it to separate entities controllers  ////will be your data source

//===================================
//====== Objects entity endpoints
//===================================
// EXAMPLE ENDPOINT: LIST ALL OBJECTS
api.get("/objects", listAllObjects);

//===================================
//====== Players entity endpoints
//===================================
api.get("/players", listAllPlayers);

module.exports = api;
