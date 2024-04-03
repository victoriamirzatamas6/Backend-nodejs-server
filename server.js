require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const cors = require('cors');

// Importă authRoutes
const authRoutes = require('./models/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));


// Folosește authRoutes pentru rutele de autentificare și înregistrare
app.use(authRoutes);



app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received login request for username:', username);
        console.log('Password received:', password); // Adăugă această linie pentru a afișa parola primită

        console.log('Searching for user in the database...');
        const user = await User.findOne({ username });
        console.log('User found:', user);

        if (!user) {
            console.log('User not found.');
            res.status(401).send('Invalid username or password.');
            return; // Ieșiți din funcție pentru a opri execuția ulterioară
        }

        console.log('Comparing passwords...');
        // Comparați parola primită cu parola hashată din baza de date
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordMatch);
        
        if (!passwordMatch) {
            console.log('User successfully authenticated:', user);

            
            res.status(200).json({ message: 'Successfully authenticated.', role: user.role, username: user.username  });
            role: user.role // Trimitem rolul utilizatorului înapoi la client
            console.log('User role:', user.role);
            
            console.log('User name:', user.username);
        } else {
            console.log('Invalid password.');
            res.status(401).send('Invalid username or password.');
        }
        
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication.');
    }
});

// Ruta pentru a prelua toți utilizatorii non-admin
app.get('/users', async (req, res) => {
    try {
      const users = await User.find({ role: 'user' }).select('-password'); // Exclude parola din rezultate
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Server error');
    }
  });
  
  // Ruta pentru a adăuga un utilizator nou
  app.post('/users', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, role: 'user' });
      await newUser.save();
      res.status(201).json({ username: newUser.username, role: newUser.role });
    } catch (error) {
      console.error('Error creating a new user:', error);
      res.status(500).send('Server error');
    }
  });
  
  app.put('/users/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const { password, ...updateData } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await User.findOneAndUpdate({ username }, updateData, { new: true }).select('-password');
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Server error');
    }
  });
  
// Endpoint pentru a prelua detaliile unui singur utilizator
app.get('/user-details/:username', async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).send('Utilizatorul nu a fost găsit.');
      }
      res.json(user);
    } catch (error) {
      console.error('Eroare la preluarea detaliilor utilizatorului:', error);
      res.status(500).send('Eroare server');
    }
  });

  app.delete('/users/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOneAndDelete({ username });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        res.status(200).send(`User ${username} deleted.`);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Server error');
    }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


