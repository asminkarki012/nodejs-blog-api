const express = require("express");
const app = express();
const multer = require('multer');
require("dotenv").config();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
app.use(express.json());

//DB connection
main().catch((err) => console.log(err));

async function main() {
  mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB connected");
}

const Storage = multer.diskStorage({
  destination: "images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: Storage });

app.post("/api/uploads", upload.single("image"), (req, res) => {
  try {
    res.status(200).json("File has been uploaded");
  } catch (err) {
    res.status(500).json(err);
  }
});


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("5000", () => {
  console.log("Port Running at 5000");
});
