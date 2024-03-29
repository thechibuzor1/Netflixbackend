import express from "express";
import User from "../Models/user.js";
import data from "../data.js";
const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
});
export default seedRouter;
