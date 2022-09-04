import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    movie: { type: Array, default: [] },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    list: [movieSchema],
    history: [movieSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
