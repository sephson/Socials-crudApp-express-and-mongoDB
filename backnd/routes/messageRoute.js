const router = require("express").Router();
const Message = require("../models/MessageModel");

//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body); //takes everything inside the body
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all msg

router.get("/:conversationId", async (req, res) => {
  try {
    const msg = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(msg);
  } catch (e) {
    res.status(500).json(e);
  }
});
module.exports = router;
