const { players } = require("../controllers/player-controller");

const isAnAvailableObject = (req, res, next) => {
  const { objectId } = req.params;
  players.some((player) => {
    return player.bag.some((objId) => objId === Number(objectId));
  })
    ? res
        .status(400)
        .send({ message: "Object not avaiable. In use by another player" })
    : next();
};

module.exports = {
  isAnAvailableObject,
};
