import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    username: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
    },
});

const User = mongoose.model('users', userSchema);
export default User;