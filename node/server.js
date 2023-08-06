// server.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let User;
let Profiles;
let Reservations;
let LoggedUser;
let Picture;

import('./models/user.js')
  .then((module) => {
    User = module.default; 
  })
  .catch((error) => {
    console.error('Error importing User module:', error);
  });

import('./models/profiles.js')
  .then((module) => {
    Profiles = module.default; 
  })
  .catch((error) => {
    console.error('Error importing Profiles module:', error);
  });

import('./models/reservations.js')
  .then((module) => {
    Reservations = module.default; 
  })
  .catch((error) => {
    console.error('Error importing Reservation module:', error);
  });

import('./models/loggedUser.js')
  .then((module) => {
    LoggedUser = module.default; 
  })
  .catch((error) => {
    console.error('Error importing LoggedUser module:', error);
  });



const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
  
const app = express();
const PORT = process.env.PORT || 3000;
//const bcrypt = require('bcrypt');
  

app.use(bodyParser.json());
app.use(cors());
  
  // Connect to MongoDB
mongoose.connect('mongodb+srv://admin:1234567890@cluster0.ugrgne2.mongodb.net/lab-reservation-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));
  
  // Route to handle user registration
app.post('/register', async (req, res) => {
  const { email, password, username} = req.body;
  
  try {
      // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
  
    // Create a new user in the database
    const newUser = new User({ email, password, username });
    await newUser.save();
  
    return res.status(201).json({ message: 'Registration successful! You may now log in.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/createProfile', async (req, res) => {
  const { username, description, picture, socialMedia } = req.body;

  try {
    // Create a new profile in the database with default values for description and picture
    const newProfile = new Profiles({
      username,
      description: description || "Default description", // Use default value if description is missing
      picture: picture || "Default picture URL", // Use default value if picture is missing
      socialMedia,
    });
    await newProfile.save();

    return res.status(201).json({ message: 'Profile created successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/saveLoggedInUser', async (req, res) => {
  const { username } = req.body;

  try {
    const newLoggedUser = new LoggedUser({ username });
    await newLoggedUser.save();

    return res.status(200).json({ message: 'Logged in user saved successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


app.get('/getLoggedUser', async (req, res) => {
  try{
    const currentUser = await LoggedUser.find({})
    return res.status(200).json(currentUser);
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
  
})

app.post('/logout', async (req, res) => {
  const { username } = req.body

  try {
    // Find and delete the user from the "loggedusers" collection
    await LoggedUser.deleteOne({ username })
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
      // Check if the user exists in the database
    const user = await User.findOne({username});
    if (!user) {
      return res.status(401).json({ error: 'User does not exist.'});
    }
  
    // Compare the provided password with the hashed password in the database
    if (password === user.password) {
      return res.status(200).json({ message: 'Login successful!' });
    } else {
      return res.status(401).json({ error: 'Password Incorrect.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});
  
app.get('/profiles', async (req, res) => {
  try {
    const allProfiles = await Profiles.find({}); // Retrieve all user profiles, excluding the '_id' field
    return res.status(200).json(allProfiles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/reservations', async (req, res) => {
  try {
    const allReservations = await Reservations.find({}); // Retrieve all user profiles, excluding the '_id' field
    return res.status(200).json(allReservations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/saveReservation', async (req, res) => {
  const { username, lab, date, seat, timeSlot, requestTime, anonymous } = req.body;

  try {
    const existingReservation = await Reservations.findOne({ username, lab, date, seat });

    if (existingReservation) {
      existingReservation.requestTime = requestTime;
      existingReservation.timeSlot.push(timeSlot); 

      await existingReservation.save();

      return res.status(200).json({ message: 'Reservation updated!' });
    } else {

      const newReservation = new Reservations({ username, lab, date, seat, timeSlot: [timeSlot], requestTime, anonymous });
      await newReservation.save();

      return res.status(200).json({ message: 'Reservation confirmed!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/resetReservation', async (req, res) => {
  const { username, lab, date, seat } = req.body;

  try {
    // Find and delete the reservation from the "reservations" collection
    const deletedReservation = await Reservations.findOneAndDelete({ username, lab, date, seat });

    if (!deletedReservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    return res.status(200).json({ message: 'Reservation deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/deleteTimeSlot', async (req, res) => {
  const { username, lab, date, seat, timeSlot } = req.body;

  try {
    const existingReservation = await Reservations.findOne({ username, lab, date, seat });

    if (!existingReservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    const updatedReservation = existingReservation.toObject();
    const timeSlotIndex = updatedReservation.timeSlot.findIndex(slot => slot === timeSlot);
    if (timeSlotIndex !== -1) {
      updatedReservation.timeSlot.splice(timeSlotIndex, 1);
    }

    await Reservations.updateOne({ username, lab, date, seat }, { $set: { timeSlot: updatedReservation.timeSlot } });

    return res.status(200).json({ message: 'Time slot deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/saveDescription', async (req, res) => {
  const { username, description } = req.body;

  try {
    const existingProfile = await Profiles.findOne({ username });

    if (existingProfile) {
      existingProfile.description = description;

      await existingProfile.save();

      return res.status(200).json({ message: 'Description updated!' });
    } else {
      return res.status(404).json({ error: 'Profile not found.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});
  // Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));