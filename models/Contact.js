const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
	{
		FirstName: {
			type: String,
			required: true,
			unique: true,
		},
		LastName: {
			type: String,
			required: true,
			unique: true,
		},

		Active: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
