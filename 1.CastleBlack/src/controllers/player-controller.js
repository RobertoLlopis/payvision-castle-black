const { players } = require("../dataSource/dataSource");
const { validate, parse } = require("schm");
const { playerSchema } = require("../schemas/playerSchema");
const { isExistingObject } = require("./object-controller");
const { notFoundResponse, simpleAutoIncrement } = require("../utils/helpers");

const listAllPlayers = (_req, res) => res.json(players);

const createPlayer = async (req, res) => {
  const player = req.body;
  //Simple autoincrement
  player.id = simpleAutoIncrement(players);
  try {
    //Parse JSON to fit with Schema data type
    const playerParsed = parse(player, playerSchema);
    //Wait for player validation
    await validate(playerParsed, playerSchema);
    players.push(playerParsed);
    res
      .status(201)
      .send({ data: playerParsed, message: "Susccesfully created" });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getPlayerById = (req, res) => {
  const { id } = req.params;
  const player = returnSinglePlayer(id);
  player
    ? res.status(200).send({ data: player })
    : notFoundResponse(res, "Player not found");
};

const armPlayer = (req, res) => {
  const { id, objectId } = req.params;
  if (isExistingPlayer(id)) {
    if (isExistingObject(objectId)) {
      players.forEach(
        (player) => player.id == id && player.bag.push(Number(objectId))
      );
      res.status(200).send({ data: returnSinglePlayer(id) });
      return;
    }
    notFoundResponse(res, "Object not found");
    return;
  }
  notFoundResponse(res, "Player not found");
};

const killPlayer = (req, res) => {
  const { id } = req.params;
  if (isExistingPlayer) {
    players.forEach(
      (player) => player.id === Number(id) && (player.health = 0)
    );
    res.status(200).send({
      data: returnSinglePlayer(id),
      message: "You kill him / her  :_(",
    });
    return;
  }
  notFoundResponse(res, "Player not found");
};

const returnSinglePlayer = (id) =>
  players.filter((player) => player.id == id)[0];

const isExistingPlayer = (id) => players.some((player) => player.id == id);

module.exports = {
  players,
  listAllPlayers,
  createPlayer,
  getPlayerById,
  armPlayer,
  killPlayer,
};
