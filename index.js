const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
//const users = require('./MOCK_DATA.json');
const app = express();
const PORT = 8000;

// Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/youtube-app-1')
  .then(() => console.log('MongDB connected'))
  .catch((err) => console.log('Mongo error', err));

// Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

// Schema Model
const User = mongoose.model('user', userSchema);

// Middleware or Pulgin
app.use(express.urlencoded({ extended: false }));

// REST API
app.get('/api/users/', async (req, res) => {
  // Always add X to custom Headers
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
  //res.setHeader('X-myName', 'Rishabh Srivastava');
  //console.log(req.headers);
  //return res.json(users);
});

// Routes
app.get('/users', async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
  <ul>
  ${allDbUsers
    .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
    .join('')}
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
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  })
  .patch(async (req, res) => {
    // edit user with id
    await User.findByIdAndUpdate(req.params.id, { lastName: 'noice' });
    return res.json({ status: 'success' });
  })
  .delete(async (req, res) => {
    // delete user with id
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: 'success' });
  });

app.post('/api/users/', async (req, res) => {
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
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    jobTitle: body.job_title,
    gender: body.gender,
  });
  console.log('result', result);
  return res.status(201).json({ msg: 'success' });
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
