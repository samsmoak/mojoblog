const router = require("express").Router();
const User = require("../models/User");

const Post = require("../models/Post");
const { verifyToken } = require("../verifyToken");

//CREATE POST

router.post("/", async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(500).json(err);
	}
});

// UPDATE POST

router.put("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try {
				const updatedPost = await Post.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				res.status(200).json(updatedPost);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("you can update only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// DELETE POST
router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try {
				await post.delete();
				res.status(200).json("post has been deleted");
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("you can delete only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//  GET POST
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ err });
	}
});

// GET ALL POST
router.get("/", async (req, res) => {
	try {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const post = await Post.find();
		const total = await Post.countDocuments({});
		const resultmodel = post.slice(startIndex, endIndex);
		res.status(200).json({ resultmodel, total: Math.ceil(total / limit) });
	} catch (err) {
		res.status(500).json({ err });
	}
	// const username = req.query.user;
	// const catName = req.query.cat;
	// try {
	// 	let posts;
	// 	if (username) {
	// 		posts = await Post.find({ username });
	// 	} else if (catName) {
	// 		posts = await Post.find({
	// 			categories: {
	// 				$in: [catName],
	// 			},
	// 		});
	// 	} else {
	// 		posts = await Post.find();
	// 	}
	// 	res.status(200).json(posts);
	// } catch (err) {
	// 	res.status(500).json({ err });
	// }
});
router.get("/recent/bat", async (req, res) => {
	try {
		const posts = await Post.find().sort({ _id: -1 }).limit(3);

		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json({ err });
	}
});
router.get("/recent/bat/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ err });
	}
});

module.exports = router;
