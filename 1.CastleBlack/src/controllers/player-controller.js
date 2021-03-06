const { players } = require("../dataSource/dataSource");
const { validate, parse } = require("schm");
const { playerSchema } = require("../schemas/playerSchema");
const { isExistingObject, returnSingleObject } = require("./object-controller");
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
        (player) =>
          player.id == id &&
          !player.bag.some((obj) => obj === Number(objectId)) &&
          player.bag.push(Number(objectId))
      );
      res.status(200).send({
        data: returnSinglePlayer(id),
        message: "Armed player with object" + objectId,
      });
      return;
    }

    notFoundResponse(res, "Object not found");
    return;
  }

  notFoundResponse(res, "Player not found");
};

const killPlayer = (req, res) => {
  const { id } = req.params;
  if (isExistingPlayer(id)) {
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

const useObject = (req, res) => {
  const {
    carrierPlayerId: carrierId,
    recieverPlayerId: recieverId,
    objectId,
  } = req.params;

  if (isExistingPlayer(carrierId) && isExistingPlayer(recieverId)) {
    if (hasPlayerObject(carrierId, objectId)) {
      const objectValue = returnSingleObject(objectId).value;

      players.forEach((player) => {
        player.id === Number(recieverId) && (player.health += objectValue);
      });

      res.status(200).send({
        data: returnSinglePlayer(recieverId),
        message: "Reciever health was updated",
      });
      return;
    }
    res
      .status(400)
      .send({ message: "Carrier does not have Object: " + objectId });
    return;
  }
  notFoundResponse(res, "Carrier or Reciever player not found");
};

const stealPlayer = (req, res) => {
  const { stealerPlayerId: stealerId, victimPlayerId: victimId } = req.params;

  if (isExistingPlayer(stealerId) && isExistingPlayer(victimId)) {
    const victim = returnSinglePlayer(victimId);

    if (victim.bag.length > 0) {
      players.forEach((player) => {
        if (player.id === Number(stealerId)) {
          player.bag = [...player.bag, ...victim.bag];
        }
      });
      players.forEach((player) => {
        if (player.id === Number(victimId)) {
          player.bag = [];
        }
      });
      res.status(200).send({
        data: {
          stealer: returnSinglePlayer(stealerId),
          victim: returnSinglePlayer(victimId),
        },
        message: `Player ${stealerId} steal the whole bag from player ${victimId}`,
      });
      return;
    }

    notFoundResponse(res, "Victim bag is empty, not found");
    return;
  }

  notFoundResponse(res, "Stealer or victim player not found");
};

const resurrectPlayer = (req, res) => {
  const { id } = req.params;
  if (isExistingPlayer(id)) {
    const playerToRescue = returnSinglePlayer(id);
    if (playerToRescue.health < 100) {
      players.forEach(
        (player) => player.id === Number(id) && (player.health = 100)
      );
      res.status(200).send({
        data: returnSinglePlayer(id),
        message: `Health of player ${id} fully restored`,
      });
      return;
    }
    res
      .status(400)
      .send({ data: null, message: "Player is already sooo healthy" });
    return;
  }
  notFoundResponse(res, "Player not found");
};

const returnSinglePlayer = (id) =>
  players.filter((player) => player.id == id)[0];

const isExistingPlayer = (id) => players.some((player) => player.id == id);

const hasPlayerObject = (playerId, objectId) =>
  players.some(
    (player) =>
      player.id === Number(playerId) &&
      player.bag.some((obj) => obj === Number(objectId))
  );

module.exports = {
  players,
  listAllPlayers,
  createPlayer,
  getPlayerById,
  armPlayer,
  killPlayer,
  stealPlayer,
  resurrectPlayer,
  useObject,
};
