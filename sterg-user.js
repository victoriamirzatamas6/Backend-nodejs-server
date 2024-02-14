const axios = require('axios');

// Definiți username-ul utilizatorului pe care doriți să-l ștergeți
const usernameToDelete = '8jynytmr';

// Trimiteți o cerere DELETE pentru a șterge utilizatorul
axios.delete(`http://localhost:3000/users/${usernameToDelete}`)
  .then(response => {
    console.log(`User '${usernameToDelete}' deleted successfully`);
  })
  .catch(error => {
    console.error(`Error deleting user '${usernameToDelete}':`, error.response.data);
  });