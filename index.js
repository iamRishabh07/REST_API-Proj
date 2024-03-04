const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const app = express();
const PORT = 8000;

// Middleware or Pulgin
app.use(express.urlencoded({ extended: false }));

// REST API
app.get('/api/users/', (req, res) => {
  // Always add X to custom Headers
  res.setHeader('X-myName', 'Rishabh Srivastava');
  //console.log(req.headers);
  return res.json(users);
});

// Routes
app.get('/users', (req, res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
  </ul>
  `;
  res.send(html);
});

// app.get('/api/users/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);
//   res.json(user);
// });

app
  .route('/api/users/:id')
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  })
  .patch((req, res) => {
    // edit user with id
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
      // Update the user's information
      const updatedUser = { ...users[index], ...req.body };
      users[index] = updatedUser;

      // Write the updated users array back to MOCK_DATA.json
      fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
          res.status(500).json({
            status: 'failure',
            message: 'An error occurred while updating the user.',
          });
        } else {
          res.json({ status: 'success', updatedUser });
        }
      });
    } else {
      res.status(404).json({ status: 'failure', message: 'User not found.' });
    }
  })
  .delete((req, res) => {
    // delete user with id
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
      const deletedUser = users.splice(index, 1);
      fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
          res.status(500).json({
            status: 'failure',
            message: 'An error occurred while deleting the user.',
          });
        } else {
          res.json({ status: 'success', deletedUser });
        }
      });
    } else {
      res.status(404).json({ status: 'failure', message: 'User not found.' });
    }
  });

app.post('/api/users/', (req, res) => {
  // create a new server
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: 'all fields are req...' });
  }
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: 'success', id: users.length });
  });
  //console.log('body', body);
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
