const express = require('express');
const { connectToMongoDb } = require('./connection');

const { logReqRes } = require('./middlewares');

const userRouter = require('./routes/user');

const app = express();
const PORT = 8000;

// Connection
connectToMongoDb('mongodb://127.0.0.1:27017/youtube-app-1').then(() => {
  console.log('MongoDB connected!');
});

// Middleware or Pulgin
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes('log.txt'));

// Routes

app.use('/api/users', userRouter);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
