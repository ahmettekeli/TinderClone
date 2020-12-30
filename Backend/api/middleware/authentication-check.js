const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
	try {
		// Extracting authentication token from headers and splitting "Bearer" text from the token.
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.userData = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Authentication failed.",
		});
	}
};

module.exports = { checkAuth };
