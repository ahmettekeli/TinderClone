const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Helper = require("../utils/helper");
const baseUrl = process.env.BASE_URL + "users/";
const saltRounds = 10;

//TODO
// 1 - fix BASE_URL.
// 2 - fix Get all.
// 3 - test update user see how nested personalinfo works?
// 4 - test handleError test.
// 5 - outsource res.status().json()
// 6 - implement user_get_user.
// 7 - authentication roles...
// 8 - implement distance calculation (How to find a set of lat long pairs surrounding a 5 miles radius, how to find lat lon pairs withing a 5 mile radius etc.)

const user_signup = (req, res, next) => {
		User.find({ email: req.body.email })
			.exec()
			.then((user) => {
				if (user.length >= 1) {
					return res.status(409).json({
						message: "Email already exist.",
					});
				} else {
					bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
						if (error) {
							res.status(500).json({
								error: error,
							});
						} else {
							const user = new User({
								_id: new mongoose.Types.ObjectId(),
								email: req.body.email,
								password: hash,
							});
							user.save()
								.then((result) => {
									res.status(201).json({
										message: "User created successfully",
									});
								})
								.catch((error) => {
									res.status(500).json({
										message: error.message,
									});
								});
						}
					});
				}
			});
	},
	user_login = (req, res, next) => {
		User.find({ email: req.body.email })
			.exec()
			.then((user) => {
				if (user.length < 1) {
					res.status(500).json({
						message: "Auth failed",
					});
				} else {
					bcrypt.compare(req.body.password, user[0].password, (error, result) => {
						if (result) {
							const token = jwt.sign(
								{
									email: user[0].email,
									userId: user[0]._id,
								},
								process.env.JWT_KEY,
								{
									expiresIn: "1h",
								}
							);
							res.status(200).json({
								message: "Auth successful",
								token: token,
							});
						} else {
							res.status(401).json({
								message: "Auth failed",
							});
						}
					});
				}
			})
			.catch((error) => {
				res.status(500).json({
					error: error.message,
				});
			});
	},
	user_delete = (req, res, next) => {
		User.deleteOne({ _id: req.params.userId })
			.exec()
			.then((result) => {
				res.status(200).json({
					message: "User deleted",
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: err,
				});
			});
	},
	user_get_all = (req, res, next) => {
		User.find()
			.select("_id email")
			.exec()
			.then((result) => {
				const response = {
					count: result.length,
					users: result.map((item) => {
						return {
							_id: item._id,
							email: item.email,
							personalInfo: item.personalInfo,
							request: {
								type: "GET",
								url: baseUrl + item._id,
							},
						};
					}),
				};
				res.status(200).json(response);
			})
			.catch((err) => {
				res.status(500).json({
					error: err.message,
				});
			});
	},
	//TODO
	users_get_users_nearby = (req, res, next) => {
		User.find({ email: req.body.email })
			.exec()
			.then((user) => {
				if (user.length < 0) {
					res.status(401).json({
						message: "User does not exist",
					});
				} else {
					User.find({})
						.exec()
						.then((nearByUsers) => {})
						.catch((error) => {
							res.status(500).json({
								error: error.message,
							});
						});
				}
				// get user location here,
			})
			.catch();
	},
	//TODO
	user_get_user = (req, res, next) => {
		User.find({ _id: req.params.id })
			.exec()
			.then((result) => {
				if (result.length > 0) {
					res.status(200).json({
						_id: result[0]._id,
						email: result[0].email,
						personalInfo: result[0].personalInfo,
						request: {
							type: "GET",
							url: baseUrl,
						},
					});
				}
			})
			.catch();
	},
	user_update = (req, res, next) => {
		const id = req.params.id;
		User.find({ _id: id })
			.exec()
			.then((result) => {
				if (result.length < 1) {
					res.status(500).json({
						message: "User does not exist.",
					});
				}
				const updateOptions = {};
				for (const option of req.body) {
					updateOptions[option.propName] = option.value;
				}
				User.updateOne({ _id: id }, { $set: updateOptions })
					.exec()
					.then((result) => {
						res.status(200).json({
							message: `User with the id ${id} has been updated successfully.`,
							request: {
								type: "GET",
								url: baseUrl + id,
							},
						});
					});
			})
			.catch((err) => {
				res.status(500).json({
					error: err.message,
				});
			});
	},
	handleError = (error, response) => {
		return response.status(500).json({
			error: error.message,
		});
	},
	calculateDistance = () => {};

module.exports = {
	user_signup,
	user_login,
	user_get_all,
	user_get_user,
	user_update,
	user_delete,
};
