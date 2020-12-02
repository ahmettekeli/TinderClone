const mongoose = require("mongoose");

const personalInfoSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	gender: {
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
	lookingfor: [
		{
			type: String,
			required: true,
		},
	],
	distance: {
		type: String,
	},
	location: {
		type: String,
	},
});

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
