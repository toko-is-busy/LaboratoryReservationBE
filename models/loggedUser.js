import mongoose from "mongoose";

const loggedSchema = new mongoose.Schema({
    username: {
      type: mongoose.SchemaTypes.String,
      required: true,
    }
});

const Logged = mongoose.model('loggedusers', loggedSchema);
export default Logged;