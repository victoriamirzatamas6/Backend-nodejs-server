require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const cors = require('cors');

// Importă authRoutes
const authRoutes = require('./models/routes/authRoutes');
const ChatHistory = require('./models/ChatHistory');

const app = express();
const PORT = process.env.PORT || 3000;

const jwtSecret = process.env.JWT_SECRET;

const Feedback = require('./models/Feedback');

const path = require('path');
app.use(express.static(path.join(__dirname, 'interfata\build')));

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));


// Folosește authRoutes pentru rutele de autentificare și înregistrare
app.use(authRoutes);

async function saveMessage(username, message, sender) {
  try {
    let chatHistory = await ChatHistory.findOne({ username: username });
    if (chatHistory) {
      // Dacă există deja un istoric, adaugă mesajul nou
      chatHistory.messages.push({
        text: message,
        sender: sender
      });
    } else {
      // Dacă nu există, creează un nou document pentru acest utilizator
      chatHistory = new ChatHistory({
        username: username,
        messages: [{
          text: message,
          sender: sender
        }]
      });
    }
    await chatHistory.save();
  } catch (error) {
    console.error("Error saving message:", error);
    throw error; // Aruncă eroarea mai departe pentru a fi gestionată de apelant
  }
}

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

            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
;

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

// Middleware pentru verificarea token-ului JWT
const verifyJWT = (req, res, next) => {
  //const token = req.headers['x-access-token'];
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).send('A token is required for authentication');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.username = decoded.username; // Asigură-te că acest câmp este corect populat
    next();
});

  
};
// Adaugă feedback nou
app.post('/feedback', async (req, res) => {
  try {
    const { text, username } = req.body;
    const feedback = new Feedback({ text, username });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).send('Error saving feedback');
  }
});

// Preluare toate feedback-urile
app.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).send('Error fetching feedbacks');
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

  // Un exemplu de ruta protejată
app.get('/protected', verifyJWT, (req, res) => {
  res.send('This is a protected route');
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

app.get('/verifyToken', verifyJWT, (req, res) => {
  // Dacă middleware-ul `verifyJWT` nu returnează eroare, tokenul este valid
  res.status(200).send('Token is valid');
  console.log("Token valid");
});

// Endpoint pentru preluarea istoricului de chat
app.get('/chatHistory', verifyJWT, async (req, res) => {
  const { username } = req;

  try {
    const chatHistory = await ChatHistory.findOne({ username });
    res.status(200).json(chatHistory ? chatHistory.messages : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Eroare la preluarea istoricului de chat." });
  }
});


// Asigură-te că "username" este extras corect din token-ul JWT și folosit în query
app.post('/saveMessage', verifyJWT, async (req, res) => {
  const username = req.username; // presupunând că "verifyJWT" adaugă "username" în "req"
  const { message, sender } = req.body;

  try {
    let chatHistory = await ChatHistory.findOne({ username: username });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ username, messages: [] });
    }
    chatHistory.messages.push({ text: message, sender: sender });
    await chatHistory.save();
    res.status(200).json({ message: "Mesaj salvat cu succes." });
  } catch (error) {
    console.error("Eroare la salvarea mesajului:", error);
    res.status(500).json({ message: "Eroare la salvarea mesajului." });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


