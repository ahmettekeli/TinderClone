const mongoose = require("mongoose");
const { personalInfoSchema } = require("./PersonalInfo");
const { matchSchema } = require("./Match");

let genders = {
	values: ["Male", "Female"],
	message: "{VALUE} is not an allowed gender type.",
};

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type: String,
		required: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	},
	password: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
		enum: genders,
	},
	dateOfBirth: {
		type: Date,
		required: true,
		max: Date.now() - 31557600000 * 18,
	},
	location: {
		type: {
			type: String,
			required: true,
			enum: ["Point"],
			default: "Point",
		},
	},
	distancePrefrence: {
		type: Number,
		required: true,
		default: 1000, // in meters
	},
	agePreference: {
		min: {
			type: Number,
			default: 18,
			required: true,
		},
		max: {
			type: Number,
			default: 60,
			required: true,
		},
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	dislikes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	lookingFor: {
		type: String,
		required: true,
		enum: genders,
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true,
	},
	personalInfo: personalInfoSchema,
	matches: [matchSchema],
});

module.exports = mongoose.model("User", userSchema);
