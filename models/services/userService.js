// services/userService.js
const User = require('../User');


/*async function createUser(username, password) {
  try {
    const user = new User({ username, password });
    await user.save();
    console.log('User created successfully:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Aruncă eroarea pentru a fi gestionată în altă parte, de exemplu în rutele de la server
  }
}*/

async function createUser(username, password, role = 'user') { // Adăugăm un parametru pentru rol cu valoarea default 'user'
  try {
    const user = new User({ username, password, role });
    await user.save();
    console.log('User created successfully:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}


module.exports = {
  createUser
};

