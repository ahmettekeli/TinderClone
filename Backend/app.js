const express = require("express");
const app = express();
//logging requests.
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./api/routes/users");

const connectionPath = process.env.CONNECTION_STRING;

mongoose.connect(connectionPath, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//logging on conseole on request.
app.use(morgan("dev"));
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

//CORS settings access for everyone
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Access, Authorization");

	//Browser always send an options request first. If that's the case let's allow browser to send following requests.
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json();
	}
	next();
});

//routes which should handle requests
app.use("/users", userRoutes);

//when no routes to handle the request
app.use((req, res, next) => {
	const error = new Error("Route not found.");
	error.status = 404;
	next(error);
});

//Error handler.
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;
