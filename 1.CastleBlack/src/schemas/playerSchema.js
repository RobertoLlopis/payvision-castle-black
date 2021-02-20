const schema = require("schm");
const playerSchema = schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  age: {
    type: Number,
    required: true,
    min: [0, "You cannot create a future character ;)"],
  },
  health: { type: Number, required: true },
  bag: [{ type: Number, min: [0, "There are not negative id numbers"] }],
});

module.exports = {
  playerSchema,
};
