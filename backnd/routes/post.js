const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  try {
    //this is to find the specific post
    const post = await Post.findById(req.params.id);
    //check if the post is yours
    //if the "user id" of the post is equal the id you input then thats your post
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("your post updated");
    } else {
      res.status(403).json("You can only update yoour post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post
router.delete("/:id", async (req, res) => {
  //find the id of that post
  try {
    const post = await Post.findById(req.params.id);
    //compare the post userId to the id the user provided

    if (post.userId === req.body.userId) {
      await post.deleteOne({ userId: post.userId });
      res.status(200).json("post deleted");
    } else {
      res.status(403).json("you cant delete a post thats not yours");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    //user with the entered id in the database
    const currentUser = await User.findById(req.params.userId);
    console.log(req.params.userId);
    //checking for post that haave a userId you entered, which means they are your posts
    const userPosts = await Post.find({ userId: currentUser._id });

    //since we are using a loop we have to use promise.all, using await alone wont fetch alll
    const friendPosts = await Promise.all(
      //the ids of the people you are following
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;