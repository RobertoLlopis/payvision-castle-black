const notFoundResponse = (res, message) => res.status(404).send({ message });
const simpleAutoIncrement = (arrayDataSource) =>
  arrayDataSource[arrayDataSource.length - 1].id + 1;
module.exports = {
  notFoundResponse,
  simpleAutoIncrement,
};
