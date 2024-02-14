const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Presupunând că aveți un model User definit

// Definiți ruta pentru ștergerea unui utilizator după username
router.delete('/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Căutați utilizatorul după username și ștergeți-l dacă există
    const deletedUser = await User.findOneAndDelete({ username });

    if (deletedUser) {
      // Returnați un mesaj către client pentru a confirma ștergerea
      res.status(200).send(`User '${username}' successfully deleted.`);
    } else {
      // Dacă nu a fost găsit niciun utilizator cu acel username, returnați un mesaj de eroare
      res.status(404).send(`User '${username}' not found.`);
    }
  } catch (error) {
    // În caz de eroare, returnați un mesaj de eroare către client
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user. Please try again later.');
  }
});

module.exports = router;
