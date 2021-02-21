const notFoundResponse = (res, message) => res.status(404).send({ message });
module.exports = {
  notFoundResponse,
};
