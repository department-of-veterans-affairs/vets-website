const { spawn, exec } = require('child_process');
const { stripAnsi } = require('./strings');
const logger = require('./logger');
const paths = require('./paths');
const { FRONTEND_PROCESS_NAME } = require('../../constants');

const processes = {};
const outputCache = {};
const MAX_CACHE_LINES = 100;
const clients = new Map();

function killProcessOnPort(portToKill) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';

    let command;
    if (isWin) {
      command = `FOR /F "tokens=5" %a in ('netstat -aon ^| find ":${portToKill}" ^| find "LISTENING"') do taskkill /F /PID %a`;
    } else {
      command = `lsof -ti :${portToKill} | xargs kill -9`;
    }

    exec(command, error => {
      if (error) {
        logger.error(`Error killing process on port ${portToKill}: ${error}`);
        reject(error);
      } else {
        logger.debug(`Process on port ${portToKill} killed`);
        resolve();
      }
    });
  });
}

function sendSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function addToCache(name, type, data) {
  if (!outputCache[name]) {
    outputCache[name] = [];
  }

  const strippedData = stripAnsi(data.toString().trim());

  // Send SSE to all connected clients for this process
  const clientsForProcess = clients.get(name) || [];
  clientsForProcess.forEach(client => {
    sendSSE(client, { type, data: strippedData });
  });

  if (type === 'status') {
    return;
  }

  outputCache[name].unshift(strippedData);
  if (outputCache[name].length > MAX_CACHE_LINES) {
    outputCache[name].pop();
  }
}

// Modify setupProcessHandlers to include status events
function setupProcessHandlers(childProcess, procName, metadata) {
  addToCache(procName, 'status', {
    status: 'started',
    timestamp: Date.now(),
    metadata,
  });

  const statusInterval = setInterval(() => {
    if (processes[procName]) {
      const clientsForProcess = clients.get(procName) || [];
      clientsForProcess.forEach(client => {
        sendSSE(client, {
          type: 'status',
          data: { status: 'running', metadata },
        });
      });
    } else {
      clearInterval(statusInterval);
    }
  }, 5000);

  childProcess.stdout.on('data', data => {
    logger.process(procName, 'stdout', data);
    addToCache(procName, 'stdout', data);
  });

  childProcess.stderr.on('data', data => {
    logger.process(procName, 'stderr', data);
    addToCache(procName, 'stderr', data);
  });

  childProcess.on('close', code => {
    logger.process(procName, 'close', code);
    addToCache(procName, 'status', 'stopped');
    clearInterval(statusInterval);
    delete processes[procName];
  });
}

function startProcess(procName, command, args, options = {}) {
  const { forceRestart = false } = options;

  const { metadata } = options;

  logger.debug(`Starting process: ${procName}`);
  logger.debug(`Command: ${command}`);
  logger.debug(`Args: ${args}`);
  logger.debug({ metadata });
  return new Promise(resolve => {
    if (processes[procName]) {
      if (!forceRestart) {
        return resolve({
          success: false,
          message: `Process ${procName} is already running`,
        });
      }

      logger.debug(`Force stopping existing process: ${procName}`);
      const oldProcess = processes[procName];

      // Clean up the old process
      oldProcess.on('close', () => {
        delete processes[procName];
        if (outputCache[procName]) {
          outputCache[procName] = [];
        }

        // Start new process after old one is fully cleaned up
        const childProcess = spawn(command, args, {
          env: process.env,
        });
        processes[procName] = childProcess;

        setupProcessHandlers(childProcess, procName, metadata);

        resolve({
          success: true,
          message: `Process ${procName} restarted`,
        });
      });

      return oldProcess.kill();
    }
    // No existing process, just start a new one
    const childProcess = spawn(command, args, {
      env: process.env,
    });
    processes[procName] = childProcess;

    setupProcessHandlers(childProcess, procName, metadata);

    return resolve({
      success: true,
      message: `Process ${procName} started`,
    });
  });
}

async function autoStartServers(options = {}) {
  const { entry, api, responses } = options;

  await killProcessOnPort('3000');
  await killProcessOnPort('3001');

  await startProcess(
    FRONTEND_PROCESS_NAME,
    'yarn',
    ['--cwd', paths.root, 'watch', '--env', `entry=${entry}`, `api=${api}`],
    {
      forceRestart: true,
      metadata: {
        entries: [entry],
      },
    },
  );

  await startProcess(
    'mock-server',
    'yarn',
    ['--cwd', paths.root, 'mock-api', '--responses', responses],
    {
      forceRestart: true,
      metadata: {
        responses,
      },
    },
  );
}

module.exports = {
  processes,
  outputCache,
  clients,
  sendSSE,
  addToCache,
  startProcess,
  autoStartServers,
  killProcessOnPort,
};
