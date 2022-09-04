import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.js";
import { isAuth, generateToken } from "../utils.js";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.post(
  "/list",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      if (user.list.find((x) => x.title === req.body.title)) {
        return res
          .status(400)
          .send({ message: "You already added this to your list" });
      } else {
        const movie = {
          movie: req.body.movie,
          title: req.body.title,
        };
        user.list.push(movie);
        await user.save();
        res.send({ message: "Movie Added" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.get(
  "/list",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send({
        list: user.list,
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.delete(
  "/list/:title",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      const movie = user.list.find((x) => x.title === req.params.title);
      if (movie) {
        user.list.pull(movie);
        await user.save();
        res.send({ message: "Movie Removed" });
      } else {
        res.status(404).send({ message: "This Movie is not in your list." });
      }
    }
  })
);

userRouter.post(
  "/history",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      if (user.history.find((x) => x.title === req.body.title)) {
        return;
      } else {
        const movie = {
          movie: req.body.movie,
          title: req.body.title,
        };
        user.history.push(movie);
        await user.save();
        res.send({ message: " " });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.get(
  "/history",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send({
        history: user.history,
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

export default userRouter;
