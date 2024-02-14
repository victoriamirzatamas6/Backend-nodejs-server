require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));



/* varianta buna -- app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received login request for username:', username);
        console.log('Password received:', password); // Adăugă această linie pentru a afișa parola primită

        console.log('Searching for user in the database...');
        const user = await User.findOne({ username });
        console.log('User found:', user);

        if (user) {
           
console.log('Password received (plaintext):', password);
console.log('Password from database (hashed):', user.password);
//const passwordMatch = await bcrypt.compare(password, user.password);

console.log('Comparing passwords...');
            // Hash-uiți parola plaintext primită de la client
            const hashedPassword = await bcrypt.hash(password, 10);
            // Comparați parola hashată cu parola hashată din baza de date
            const passwordMatch = await bcrypt.compare(hashedPassword, user.password);
            console.log ('Parola de la client hash-uita:', hashedPassword);
            console.log ('Parola userului hashuita:',user.password);
            console.log('Password match:', passwordMatch);


            if (passwordMatch) {
                console.log('User successfully authenticated:', user);
                res.status(200).send('Successfully authenticated.');
            } else {
                console.log('Invalid password.');
                res.status(401).send('Invalid username or password.');
            }
        } else {
            console.log('User not found.');
            res.status(401).send('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication.');
    }
});
*/
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received login request for username:', username);
        console.log('Password received:', password); // Adăugă această linie pentru a afișa parola primită

        console.log('Searching for user in the database...');
        const user = await User.findOne({ username });
        console.log('User found:', user);

        if (user) {
            console.log('Comparing passwords...');
            // Comparați parola primită cu parola hashată din baza de date
            const passwordMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', passwordMatch);
            

            if (passwordMatch==0) {
                console.log('User successfully authenticated:', user);
                res.status(200).send('Successfully authenticated.');
                
            } else {
                console.log('Invalid password.');
                res.status(401).send('Invalid username or password.');
            }
        } else {
            console.log('User not found.');
            res.status(401).send('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication.');
    }
});
/*app.post('/login', async (req, res) => {
    try {
        const { username } = req.body;
        console.log('Received login request for username:', username);

        console.log('Searching for user in the database...');
        const user = await User.findOne({ username });
        console.log('User found:', user);

        if (user) {
            console.log('User successfully authenticated:', username);
            res.status(200).send('Successfully authenticated.');
        } else {
            console.log('User not found.');
            res.status(401).send('Invalid username');
        }

        
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication.');
    }
    
});

*/


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


