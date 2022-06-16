const jwt = require("jsonwebtoken");
const User = require("./models/User");

const verifyToken = async (req, res, next) => {
	const authHeader = req.headers.token;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		try {
			const decode = jwt.verify(token, process.env.JWT_SEC);
			const user = await User.findById(decode.id);

			if (!user) {
				return res.json({ success: true, message: "unauthorised access" });
			}
			req.user = user;
			next();
		} catch (err) {}
	} else {
		return res.status(401).json("You are not authenticated!");
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id) {
			next();
		} else {
			res.status(403).json("You are not alowed to do that!");
		}
	});
	// req.user = user;
	// next();
};

// const verifyTokenAndAdmin = (req, res, next) => {
// 	verifyToken(req, res, () => {
// 		if (req.user.isAdmin) {
// 			next();
// 		} else {
// 			res.status(403).json("You are not alowed to do that!");
// 		}
// 	});
// };

module.exports = { verifyToken, verifyTokenAndAuthorization };
