require("dotenv").config();
const config = require("./config.json");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/userModel");
const TravelStory = require("./models/travelStoryModel");
const Upload = require("./multer");
const fs = require("fs");
const path = require("path");
const { authentication } = require("./utilities");
const Comment = require("./models/commentModel");

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/create-account", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: "true", message: "All Fields are required" });
  }
  const isUser = await User.findOne({ email });

  if (isUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullname,
    email,
    password: hashedpassword,
  });

  await user.save();

  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "72h",
  });

  return res.status(200).json({
    error: "false",
    user: { fullname: user.fullname, email: user.email },
    accessToken,
    message: "Registration Completed",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please Fill The Requirements" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User Does not exist" });
  }
  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    return res.status(400).json({ message: "Credential Doesn't Match" });
  }
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "72h",
  });

  return res.status(200).json({
    error: "false",
    user: { fullname: user.fullname, email: user.email },
    accessToken,
    message: "Login Successful",
  });
});

app.get("/get-user", authentication, async (req, res) => {
  const userId = req.user.userId; // Access the userId from the decoded token
  const Isuser = await User.findById(userId);

  if (!Isuser) {
    return res.sendStatus(400); // Bad Request
  }

  return res.json({
    user: Isuser,
  });
});

app.post("/add-travel-story", authentication, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;
  console.log("Received data:", req.body);
  console.log("User ID:", req.user?.userId);

  if (!title || !story || !visitedDate || !userId) {
    return res
      .status(400)
      .json({ error: true, message: "All Fields are Required" });
  }

  const parsedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedDate,
    });

    await travelStory.save();
    console.log("tob tobitto");
    return res
      .status(200)
      .json({ story: travelStory, message: "Story added successfully" });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
});

app.get("/get-travel-stories", authentication, async (req, res) => {
  const { userId } = req.user;
  try {
    const travelStory = await TravelStory.find({ userId: userId }).sort({
      isFavourite: -1,
    });
    res.status(200).json({ stories: { travelStory } });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
});

app.get("/get-all-travel-stories", async (req, res) => {
  try {
    const travelStory = await TravelStory.find();
    res.status(200).json({ stories: { travelStory } });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
});

app.put("/edit-travel-stories/:id", authentication, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (
    !title ||
    !story ||
    !visitedLocation ||
    !imageUrl ||
    !visitedDate ||
    !userId
  ) {
    return res
      .status(400)
      .json({ error: true, message: "All Fields are Required" });
  }

  const parsedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Story not found" });
    }

    const placeholderImgUrl = "http://localhost:8000/assets/placeholder.png";

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImgUrl;
    travelStory.visitedDate = parsedDate;

    await travelStory.save();
    res
      .status(200)
      .json({ story: travelStory, message: "Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

app.delete("/delete-travel-story/:id", authentication, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    const placeholderImgUrl = "http://localhost:8000/assets/placeholder.png";

    if (!travelStory) {
      res.status(400).json({ error: true, message: "No Story Found" });
    }
    await TravelStory.deleteOne({ _id: id, userId: userId });
    const filename = path.basename(imageUrl);

    const filepath = path.join(__dirname, "uploads", filename);
    fs.unlinkSync(filepath);
    return res.status(400).json({ message: "Story Deleted Successfully" });
  } catch (err) {
    res.status(200).json({ error: true, message: err.message });
  }
});
app.put("/update-isfavourite/:id", authentication, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { isFavourite } = req.body; // Extract the field from the request body
  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res.status(400).json({ error: true, message: "No Story Found" });
    }

    // Ensure that isFavourite is explicitly cast to a boolean
    travelStory.isFavourite = Boolean(isFavourite);
    await travelStory.save();

    return res
      .status(200) // Fixed status code
      .json({ story: travelStory, message: "Favourite Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message }); // Fixed status code
  }
});

app.get("/search", authentication, async (req, res) => {
  const query = req.query;
  const { userId } = req.user;
  if (!query) {
    res.status(400).json({ error: true, message: "Query is required" });
  }
  try {
    searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });
    res.status(200).json({ stories: searchResults });
  } catch (err) {
    res.status(200).json({ error: true, message: err.message });
  }
});
app.get("/travel-stories/filter", authentication, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    const filteredSearch = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: filteredSearch });
  } catch (err) {
    res.status(200).json({ error: true, message: err.message });
  }
});
// Get comments for a story
app.get("/stories/:storyId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      storyId: req.params.storyId,
    }).populate("user");
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add a comment
app.post("/stories/:storyId/comments", authentication, async (req, res) => {
  const userId = req.user.userId; // Access the userId from the decoded token
  console.log(userId);
  const Isuser = await User.findById(userId);
  try {
    console.log(req.body.content);
    console.log(Isuser);
    console.log(req.params.storyId);

    const newComment = await Comment.create({
      storyId: req.params.storyId,
      user: Isuser,
      content: req.body.content,
    });
    await newComment.save();
    res.json({ comment: newComment });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Like a comment
app.post(
  "/stories/:storyId/comments/:commentId/like",
  authentication,
  async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      comment.likes += 1;
      await comment.save();
      res.json({ likes: comment.likes });
    } catch (err) {
      res.status(500).json({ error: "Failed to like comment" });
    }
  }
);

// Reply to a comment
app.post(
  "/stories/:storyId/comments/:commentId/reply",
  authentication,
  async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      comment.replies.push({ user: req.user.id, content: req.body.content });
      await comment.save();
      res.json({ reply: comment.replies[comment.replies.length - 1] });
    } catch (err) {
      res.status(500).json({ error: "Failed to add reply" });
    }
  }
);

app.post("/add-image", Upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No image uploaded" });
    }
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

    return res.status(201).json({ imageUrl });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
});

app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    return res.status(400).json({ error: true, message: "No image found" });
  }
  try {
    const filename = path.basename(imageUrl);

    const filepath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return res.status(400).json({ message: "Image Deleted Successfully" });
    }
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.listen(8000);
module.exports = app;
