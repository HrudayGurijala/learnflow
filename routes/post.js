const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment");
const { ensureAuth } = require("../middleware/auth");
const { ensureSignUp, ensureCreator } = require("../middleware/user");
const Post = mongoose.model("posts");
const User = mongoose.model("users");
const Comment = mongoose.model("comments");
const Like = mongoose.model("likes");
const View = mongoose.model("views");

router.get(
  "/create/post",
  ensureAuth,
  ensureSignUp,
  ensureCreator,
  (req, res) => {
    res.render("create-post");
  }
);
router.get(
  "/myown/post",
  ensureAuth,
  ensureSignUp,
  ensureCreator,
  async (req, res) => {
    try{
      const user = req.user;
      const posts = await Post.find({userID: user._id});
      res.locals.ownposts = posts;
      res.render("own-post");
    }
    catch (error) {
      console.log(error);
      res.render("error-500");
    } 
  }
);

router.post(
  "/create/post",
  ensureAuth,
  ensureSignUp,
  ensureCreator,
  async (req, res) => {
    try {
      const user = req.user;
      const post = await Post.create({
        ...req.body,
        userID: user._id,
      });

      res.status(200).send(post);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "Something went wrong",
      });
    }
  }
);

router.get("/post/:id", ensureAuth, async (req, res) => {
  const postID = req.params.id;
  try {
    const post = await Post.findById(postID);
    if (!post) {
      return res.redirect("/post-not-found"); 
    }
    const author = await User.findById(post.userID);
    const postDate = moment(post.createdAt).format("dddd, MMMM Do YYYY");
    const comments = await Comment.find({ postID: postID, depth: 1 });
    
    let likeDoc = await Like.findOne({ userID: post.userID, postID: postID });
    let temp = false;
    if (likeDoc) temp = true;
    res.locals.liked = temp;

    let viewDoc = await View.findOne({ userID: post.userID, postID: postID });
    let view = false;
    if (viewDoc) view = true;
    res.locals.viewed = view;

    res.locals.post = post;
    res.locals.comments = comments;
    res.locals.author = author;
    res.locals.postDate = postDate;

    res.render("post");
  } catch (error) {
    console.log(error);
    res.render("error-500");
  }
});


router.patch("/post/like", ensureAuth, async (req, res) => {
  const id = req.body.id;
  try {
    const post = await Post.findById(id);
    const user = req.user;
    const doucs = await Like.find({userID: user.googleID,postID: id});
    const size = doucs.length;

    if(size == 0)
    {
    post.likes += 1;
    await post.save();

    const like = await Like.create({
      userID: req.user.googleID,
      postID: id,
    });
    res.status(200).json({});
    }
    else
    res.status(400).json({});
  } catch (error) {
    console.log(error);
    res.status(400).json({});
  }
});

router.delete("/post/delete", ensureAuth,ensureCreator, async (req, res) => {
  const id = req.body.id;
  try {
    const post = await Post.findById(id);
    await Post.deleteOne({_id: id});  
    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(400).json({});
  }
});

router.patch("/post/view", ensureAuth, async (req, res) => {
  const id = req.body.id;
  try {
    const post = await Post.findById(id);
    post.views += 1;
    await post.save();
    const view = await View.create({
      userID: req.user.googleID,
      postID: id,
    });
    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(400).json({});
  }
});

router.get('/search', ensureAuth, async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const regex = new RegExp(searchQuery, 'i'); 
    const posts = await Post.find({ title: { $regex: regex } });
    res.locals.queryposts = posts;
    res.render("querypost");
  } catch (error) {
    console.log(error);
    res.status(400).json({});
  }
});


module.exports = router;
