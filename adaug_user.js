/*const axios = require('axios');

const userData = {
  username: 'utilizator2',
  password: 'parola456'
};

axios.post('http://localhost:3000/register', userData)
  .then(response => {
    console.log('User created successfully');
  })
  .catch(error => {
    console.error('Error creating user:', error.response.data);
  });
*/
/*const axios = require('axios');

const userData = {
  username: 'grgrehbr',
  password: 'parola789'
};

axios.post('http://localhost:3000/register', userData)
  .then(response => {
    console.log('User created successfully');
  })
  .catch(error => {
    console.error('Error creating user:', error.response.data);
  });
*/
/*const axios = require('axios');

const userData = {
  username: '8jynytmr',
  password: 'parolverd9'
};

axios.post('http://localhost:3000/register', userData)
  .then(response => {
    console.log('User created successfully');
  })
  .catch(error => {
    console.error('Error creating user:', error.response.data);
  });
  */

  const axios = require('axios');

const userData = {
  username: 'angajat_nou',
  password: 'secure-password',
  role: 'user' // Specificăm explicit că acesta este un utilizator obișnuit
};

axios.post('http://localhost:3000/register', userData)
  .then(response => {
    console.log('User created successfully');
  })
  .catch(error => {
    console.error('Error creating user:', error.response.data);
  });