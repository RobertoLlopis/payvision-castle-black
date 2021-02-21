const { validate, parse } = require("schm");
const { objectSchema } = require("../schemas/objectSchema");
const { simpleAutoIncrement, notFoundResponse } = require("../utils");

const objects = [
  { id: 1, name: "spoon", value: -1 },
  { id: 2, name: "knife", value: -10 },
  { id: 3, name: "sword", value: -20 },
  { id: 4, name: "potion", value: +20 },
];
const listAllObjects = (_req, res) => res.json(objects);

const createObject = async (req, res) => {
  const object = req.body;
  //Simple autoincrement
  object.id = simpleAutoIncrement(objects);
  try {
    //Parse JSON to fit with Schema data type
    const objectParsed = parse(object, objectSchema);
    //Wait for object validation
    await validate(objectParsed, objectSchema);
    objects.push(objectParsed);
    res
      .status(201)
      .send({ data: objectParsed, message: "Susccesfully created" });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getObjectById = (req, res) => {
  const { id } = req.params;
  const object = objects.filter((object) => object.id == id)[0];
  object
    ? res.status(200).send({ data: object })
    : notFoundResponse(res, "Object not found");
};

const upgradeObject = (req, res) => {
  const { id, newValue } = req.params;
  if (isExistingObject(id)) {
    objects.forEach((obj) => obj.id === Number(id) && (obj.value = newValue));
    res.status(200).send({
      data: returnSingleObject(id),
      message: "Object  successfully upgraded.",
    });
    return;
  }
  notFoundResponse(res, "Object not found");
};

const isExistingObject = (id) => objects.some((object) => object.id == id);

const returnSingleObject = (id) =>
  objects.filter((object) => object.id == id)[0];
module.exports = {
  objects,
  listAllObjects,
  isExistingObject,
  createObject,
  getObjectById,
  upgradeObject,
};
