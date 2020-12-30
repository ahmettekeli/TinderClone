const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	chat: {
		type: Schema.Types.ObjectId,
		ref: "Chat",
		required: true,
	},
});

module.exports = {
	Match: mongoose.model("Match", matchSchema),
	matchSchema,
};
