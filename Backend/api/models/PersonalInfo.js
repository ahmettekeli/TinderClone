const mongoose = require("mongoose");

const personalInfoSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
	},
	photos: [
		{
			type: String,
		},
	],
	summary: {
		type: String,
	},
	job: {
		type: String,
	},
	company: {
		type: String,
	},
	school: {
		type: String,
	},
	city: {
		type: String,
	},
});

module.exports = {
	PersonalInfo: mongoose.model("PersonalInfo", personalInfoSchema),
	personalInfoSchema,
};
