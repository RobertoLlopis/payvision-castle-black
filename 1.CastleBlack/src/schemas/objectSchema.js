const schema = require("schm");

const objectSchema = schema({
  id: Number,
  name: { type: String, required: true },
  value: { type: Number, required: true },
});

module.exports = {
  objectSchema,
};
