const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  pictureUrl: {
    type: String,
    required: true,
  },
});

const Picture = mongoose.model('picture', pictureSchema);

export default Picture;
