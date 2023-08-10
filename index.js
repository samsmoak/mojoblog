const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/config.env" });
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const emailRoute = require("./routes/email");
const contactRoute = require("./routes/contact");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

app.use(
	cors({
		origin: "*",
	})
);
// app.use(cors());
app.use(function (req, res, next) {
	res.header(
		"Access-Control-Allow-Origin",
		"*",
		"Access-Control-Allow-Credentials",
		"true",
		"Access-Control-Allow-Methods",
		"GET,HEAD,OPTIONS,POST,PUT,DELETE",
		"Access-Control-Allow-Headers",
		"Origin,Cache-Control,Accept,X-Access-Token ,X-Requested-With, Content-Type, Access-Control-Request-Method"
	);
	next();
});
app.use("/images", express.static(path.join(__dirname, "/images")));

dotenv.config();
app.use(express.json());
mongoose
	.connect(process.env.MONGO_URL)
	.then(console.log("connected to mongoDB"))
	.catch((err) => console.log(err));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
	res.status(200).json("file has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/email", emailRoute);
app.use("/api/contact", contactRoute);
// app.use("/api/email", emailRoute);
app.use("/api/categories", categoryRoute);

app.listen(process.env.PORT, () => {
	console.log("Backend is running");
});
// /Users/samsmoaki/Desktop/tailwind projects/blogapp/api/config.env
