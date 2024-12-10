const { spawn } = require('child_process');
const { stripAnsi, killProcessOnPort } = require('./utils');
const logger = require('./logger');
const paths = require('./paths');

const processes = {};
const outputCache = {};
const MAX_CACHE_LINES = 100;
const clients = new Map();

function sendSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function addToCache(name, type, data) {
  if (!outputCache[name]) {
    outputCache[name] = [];
  }
  const strippedData = stripAnsi(data.toString().trim());
  outputCache[name].unshift(strippedData);
  if (outputCache[name].length > MAX_CACHE_LINES) {
    outputCache[name].pop();
  }

  // Send SSE to all connected clients for this process
  const clientsForProcess = clients.get(name) || [];
  clientsForProcess.forEach(client => {
    sendSSE(client, { type, data: strippedData });
  });
}

// Setup process handlers for stdout, stderr, and close events
// this way we can handle the process starting and stopping in a single function
function setupProcessHandlers(childProcess, procName) {
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
    const clientsForProcess = clients.get(procName) || [];
    clientsForProcess.forEach(client => {
      sendSSE(client, {
        type: 'close',
        data: `Process exited with code ${code}`,
      });
    });
    delete processes[procName];
  });
}

function startProcess(procName, command, args, options = {}) {
  const { forceRestart = false } = options;

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

        setupProcessHandlers(childProcess, procName);

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

    setupProcessHandlers(childProcess, procName);

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
    'fe-dev-server',
    'yarn',
    ['--cwd', paths.root, 'watch', '--env', `entry=${entry}`, `api=${api}`],
    {
      forceRestart: true,
    },
  );

  await startProcess(
    'mock-server',
    'node',
    [paths.mockApi, '--responses', responses],
    {
      forceRestart: true,
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
};
