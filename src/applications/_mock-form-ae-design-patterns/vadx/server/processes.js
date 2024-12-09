const { spawn } = require('child_process');
const path = require('path');
const { stripAnsi } = require('./utils');
const logger = require('./utils/logger');

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

function startProcess(procName, command, args, env = {}) {
  if (processes[procName]) {
    return {
      success: false,
      message: `Process ${procName} is already running`,
    };
  }

  const childProcess = spawn(command, args, {
    env: { ...process.env, ...env },
  });
  processes[procName] = childProcess;

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
    // Notify all clients that the process has ended
    const clientsForProcess = clients.get(procName) || [];
    clientsForProcess.forEach(client => {
      sendSSE(client, {
        type: 'close',
        data: `Process exited with code ${code}`,
      });
    });
    delete processes[procName];
  });

  childProcess.on('exit', code => {
    logger.process(procName, 'exit', code);
    // Notify all clients that the process has ended
    const clientsForProcess = clients.get(procName) || [];
    clientsForProcess.forEach(client => {
      sendSSE(client, {
        type: 'close',
        data: `Process exited with code ${code}`,
      });
    });
    delete processes[procName];
  });

  return { success: true, message: `Process ${procName} started` };
}

function autoStartServers() {
  const root = path.resolve(__dirname, '..', '..', '..', '..', '..');

  startProcess('fe-dev-server', 'yarn', [
    '--cwd',
    root,
    'watch',
    '--env',
    'entry=mock-form-ae-design-patterns',
    'api=http://localhost:3000',
  ]);

  startProcess(
    'mock-server',
    'node',
    [
      `${root}/src/platform/testing/e2e/mockapi.js`,
      '--responses',
      `${root}/src/applications/_mock-form-ae-design-patterns/mocks/server.js`,
    ],
    { AEDEBUG: 'true' },
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
