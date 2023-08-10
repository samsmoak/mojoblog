const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema(
	{
		companyName: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},

		phoneNumber: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Email", EmailSchema);
