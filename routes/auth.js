const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyTokenAndAuthorization, verifyToken } = require("../verifyToken");

//Resgister

router.post("/register", async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(req.body.password, salt);
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPass,
		});

		const user = await newUser.save();
		res.status(200).send(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Login

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		!user && res.status(400).json("wrong credential!");

		const validated = await bcrypt.compare(req.body.password, user.password);
		!validated && res.status(400).json("wrong credential!");
		if (validated) {
			const accessToken = jwt.sign(
				{
					id: user._id,
					isAdmin: user.isAdmin,
				},
				process.env.JWT_SEC,
				{ expiresIn: "1d" }
			);
			const { password, ...other } = user._doc;

			res.status(200).json({ ...other, accessToken });
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
router.post("/logout", verifyToken, async (req, res) => {
	const authHeader = req.headers.token;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		// jwt.verify(token, process.env.JWT_SEC, (err, user) => {
		// 	if (err) res.status(403).json("Token is not valid!");
		// 	req.user = user;
		// 	next();
		// });
		if (!token) {
			return res
				.status()
				.json({ success: false, message: "authorisation failed" });
		}
		const tokens = req.user.tokens;
		console.log(tokens);
		const newTokens = tokens.filter((t) => t !== token);
		await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
		res.json({ success: true, message: "signout successful" });
	}
});

module.exports = router;
