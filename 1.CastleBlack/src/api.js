const { Router } = require("express");
const api = Router();
const {
  listAllObjects,
  createObject,
  getObjectById,
  upgradeObject,
  deleteObject,
} = require("./controllers/object-controller");
const {
  listAllPlayers,
  createPlayer,
  getPlayerById,
  armPlayer,
  killPlayer,
  attackPlayer,
  stealPlayer,
  resurrectPlayer,
  useObject,
} = require("./Controllers/player-controller");
const { AuthMiddleware } = require("./middlewares/Auth");
const { isAnAvailableObject } = require("./middlewares/isAnAvailableObject");
// This was my data source. I move it to separate entities controllers  ////will be your data source

//===================================
//===Basic authentication middleware
//===================================
api.use(AuthMiddleware);

//===================================
//====== Objects entity endpoints
//===================================
// EXAMPLE ENDPOINT: LIST ALL OBJECTS
api.get("/objects", listAllObjects);
api.post("/objects", createObject);
api.get("/objects/:id", getObjectById);
api.patch("/objects/:id/upgrade/:newValue", upgradeObject);
api.delete("/objects/:id", deleteObject);

//===================================
//====== Players entity endpoints
//===================================
api.get("/players", listAllPlayers);
api.post("/players", createPlayer);
api.get("/players/:id", getPlayerById);
api.patch("/players/:id/arm/:objectId", armPlayer);
api.patch("/players/:id/kill", killPlayer);
api.patch("/players/:id/pickup/:objectId", isAnAvailableObject, armPlayer);
api.patch("/players/steal/:stealerPlayerId/:victimPlayerId", stealPlayer);
api.patch("/players/:id/resurrect", resurrectPlayer);
api.patch(
  "/players/:carrierPlayerId/use/:recieverPlayerId/:objectId",
  useObject
);

module.exports = api;
