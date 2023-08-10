const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Email = require("../models/Email");

router.post("/", async (req, res) => {
	const newEmail = new Email(req.body);
	try {
		const savedEmail = await newEmail.save();
		res.status(200).json(savedEmail);
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
