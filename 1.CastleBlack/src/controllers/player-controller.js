const { validate, parse } = require("schm");
const { playerSchema } = require("../schemas/playerSchema");
const players = [
  { id: 1, name: "Jon Snow", age: 23, health: 100, bag: [1] },
  { id: 2, name: "Littlefinger", age: 35, health: 100, bag: [2] },
  { id: 3, name: "Daenerys Targaryen", age: 20, health: 100, bag: [3] },
  { id: 4, name: "Samwell Tarly", age: 18, health: 100, bag: [4] },
];

const listAllPlayers = (_req, res) => res.json(players);

const createPlayer = async (req, res) => {
  const player = req.body;
  //Simple autoincrement
  player.id = players[players.length - 1].id + 1;
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
  const player = players.filter((player) => player.id == id)[0];
  player
    ? res.status(200).send({ data: player })
    : res.status(404).send({ message: "Player not found" });
};

module.exports = {
  listAllPlayers,
  createPlayer,
  getPlayerById,
};
