const schema = require("schm");

const objectSchema = schema({
  id: Number,
  name: String,
  value: Number,
});

module.exports = {
  objectSchema,
};
