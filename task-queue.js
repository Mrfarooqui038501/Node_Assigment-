const fs = require('fs');
const rateLimiter = require('./rate-limiter');

const taskQueue = {};

const addTask = (userId, task) => {
  if (rateLimiter.isRateLimited(userId)) {
    rateLimiter.addTaskToQueue(userId, task);
  } else {
    task();
    rateLimiter.processNextTask(userId);
  }
};

const processQueue = (userId) => {
  rateLimiter.processNextTask(userId);
};

module.exports = {
  addTask,
  processQueue,
};