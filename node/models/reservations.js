import mongoose from "mongoose";

const reserveSchema = new mongoose.Schema({
    username: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    lab: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    date: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    seat: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    timeSlot: {
        type: mongoose.SchemaTypes.Array,
        required: true,
    },
    requestTime: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    anonymous:{
        type: mongoose.SchemaTypes.Boolean,
        required: true
    }
});

const reservation = mongoose.model('reservations', reserveSchema);
export default reservation;