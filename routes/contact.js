const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Contact = require("../models/Contact");

//  GET POST
router.get("/", async (req, res) => {
	try {
		const contact = await Contact.find();
		// posts = await Post.find();
		res.status(200).json(contact);
	} catch (err) {
		res.status(500).json({ err });
	}
});

router.post("/", async (req, res) => {
	const newContact = new Contact(req.body);
	try {
		const savedContact = await newContact.save();
		res.status(200).json(savedContact);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.put("/:id", async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);

		try {
			const updatedContact = await Contact.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true }
			);
			res.status(200).json(updatedContact);
		} catch (err) {
			res.status(500).json(err);
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// DELETE POST–
router.delete("/:id", async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);

		try {
			await contact.delete();
			res.status(200).json("post has been deleted");
		} catch (err) {
			res.status(500).json(err);
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
