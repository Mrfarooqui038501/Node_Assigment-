const express = require('express');
const app = express();
const taskQueue = require('./task-queue');
const task = require('./task');
const {rateLimit} = require('express-rate-limit')
const slowDown = require("express-slow-down");

app.use(express.json());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: () => 10000,
});

app.use(speedLimiter);

// Apply the rate limiting middleware to all requests.
app.use(limiter)


app.post('/api/v1/task',(req, res) => {
  const userId = req.body.user_id;
  const taskFunction = () => {
    task(userId);
  };
  taskQueue.addTask(userId, taskFunction);
  res.send(`Task added to queue for user ${userId}`);
});



app.listen(3000, () => {
  console.log('Server listening on port 3000');
});