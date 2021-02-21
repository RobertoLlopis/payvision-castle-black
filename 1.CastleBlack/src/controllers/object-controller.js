const objects = [
  { id: 1, name: "spoon", value: -1 },
  { id: 2, name: "knife", value: -10 },
  { id: 3, name: "sword", value: -20 },
  { id: 4, name: "potion", value: +20 },
];
const listAllObjects = (_req, res) => res.json(objects);

const isExistingObject = (id) => objects.some((object) => object.id == id);

module.exports = {
  objects,
  listAllObjects,
  isExistingObject,
};
