import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/UserRoutes.js";
import mongoose from "mongoose";
import seedRouter from "./routes/seedRoutes.js";

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/seed", seedRouter);
app.use("/api/users", userRouter);

 
app.get("/", (req, res) => {
  res.send("INDOMITABLE SUIIII");
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
