const rateLimiter = {};

const limits = {
  perSecond: 1,
  perMinute: 20,
};

const getQueue = (userId) => {
  if (!rateLimiter[userId]) {
    rateLimiter[userId] = {
      queue: [],
      lastTaskTime: 0,
      tasksInLastMinute: 0,
    };
  }
  return rateLimiter[userId];
};

const isRateLimited = (userId) => {
  const queue = getQueue(userId);
  const now = Date.now();
  const timeSinceLastTask = now - queue.lastTaskTime;
  const tasksInLastMinute = queue.tasksInLastMinute;

  if (timeSinceLastTask < 1000) {
    // 1 task per second
    return true;
  }

  if (tasksInLastMinute >= limits.perMinute) {
    // 20 tasks per minute
    return true;
  }

  return false;
};

const addTaskToQueue = (userId, task) => {
  const queue = getQueue(userId);
  queue.queue.push(task);
};

const processNextTask = (userId) => {
  const queue = getQueue(userId);
  if (queue.queue.length > 0) {
    const task = queue.queue.shift();
    task();
    queue.lastTaskTime = Date.now();
    queue.tasksInLastMinute++;
    setTimeout(() => {
      queue.tasksInLastMinute--;
    }, 60000);
  }
};

module.exports = {
  isRateLimited,
  addTaskToQueue,
  processNextTask,
};