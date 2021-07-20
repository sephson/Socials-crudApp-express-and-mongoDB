const router = require("express").Router();
const Convo = require("../models/ConvoModel");

//new convo
router.post("/", async (req, res) => {
  const newConvo = new Convo({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConvo = await newConvo.save();
    res.status(200).json(savedConvo);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user
router.get("/:userId", async (req, res) => {
  try {
    const convo = await Convo.find({ members: { $in: [req.params.userId] } });
    res.status(200).json(convo);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
