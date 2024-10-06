const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'logs', 'task-logs.log');

if (!fs.existsSync(path.dirname(logFile))) {
  fs.mkdirSync(path.dirname(logFile));
}

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, '');
}

async function task(userId) {
  console.log(`${userId}-task completed at-${Date.now()}`);
  fs.appendFile(logFile, `${userId}-task completed at-${Date.now()}\n`, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = task;