const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

const convoRoute = require("./routes/convoRoute");
const messageRoute = require("./routes/messageRoute");

const multer = require("multer");
const path = require("path");
const app = express();

dotenv.config();
mongoose.connect(
  process.env.MONGO_URL,
  {
    useCreateIndex: true,

    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to database");
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File upload successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/convo", convoRoute);
app.use("/api/messages", messageRoute);

app.listen(8000, () => {
  console.log("server running");
});
