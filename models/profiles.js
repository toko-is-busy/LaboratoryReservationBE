import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    description: { // Fixed the field name to 'description'
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    picture: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    socialMedia: {
        facebook: { type: mongoose.SchemaTypes.String },
        twitter: { type: mongoose.SchemaTypes.String },
        instagram: { type: mongoose.SchemaTypes.String },
    },
});

const profile = mongoose.model('profiles', profileSchema);
export default profile;