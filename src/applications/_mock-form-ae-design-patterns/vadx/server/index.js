/* eslint-disable no-console */
const express = require('express');
const { spawn } = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;

const cors = require('./cors');
const { killProcessOnPort, stripAnsi } = require('./utils');

const app = express();
const port = 1337;

app.use(express.json());
// Allow CORS with pretty open settings
app.use(cors);

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

function startProcess(procName, command, args, env = {}, color = 'green') {
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
    console.log(`${chalk[color](`[${procName}] stdout:`)} ${data}`);
    addToCache(procName, 'stdout', data);
  });

  childProcess.stderr.on('data', data => {
    console.log(`${chalk.red(`[${procName}] stderr:`)} ${data}`);
    addToCache(procName, 'stderr', data);
  });

  childProcess.on('close', code => {
    console.log({ code });
    console.log(
      chalk.whiteBright.bgRed(`[${procName}] process CLOSED with code ${code}`),
    );
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
    console.log(`[${procName}] process EXITED with code ${code}`);
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
  // get path to root of the repo
  const root = path.resolve(__dirname, '..', '..', '..', '..', '..');
  console.log({ root });

  // Start Frontend Dev Server - modified to run from root
  startProcess('fe-dev-server', 'yarn', [
    '--cwd',
    root,
    'watch',
    '--env',
    'entry=mock-form-ae-design-patterns',
    'api=http://localhost:3000',
  ]);

  // Start Mock API Server
  startProcess(
    'mock-server',
    'node',
    [
      `${root}/src/platform/testing/e2e/mockapi.js`,
      '--responses',
      `${root}/src/applications/_mock-form-ae-design-patterns/mocks/server.js`,
    ],
    { AEDEBUG: 'true' },
    'blue',
  );

  console.log('Auto-started Frontend Dev Server and Mock API Server');
}

// ENDPOINTS
app.post('/start', (req, res) => {
  const { name, command, args, env } = req.body;
  const result = startProcess(name, command, args, env);
  res.json(result);
});

app.get('/status', (req, res) => {
  const status = Object.keys(processes).reduce((acc, name) => {
    acc[name] = {
      pid: processes[name].pid,
      killed: processes[name].killed,
      exitCode: processes[name].exitCode,
      signalCode: processes[name].signalCode,
      args: processes[name].spawnargs,
    };
    return acc;
  }, {});
  res.json(status);
});

app.post('/update-toggles-file', async (req, res) => {
  const { updateToggle } = req.body;
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'mocks',
    'endpoints',
    'feature-toggles',
    'index.js',
  );

  console.log({ filePath });

  try {
    // Read the current file content
    let content = await fs.readFile(filePath, 'utf8');

    console.log(content);

    // Update the content
    const newDate = new Date().toISOString();
    content = content.replace(/updated: .*,/, `updated: '${newDate}',`);

    if (updateToggle) {
      content += '\n// File updated via API';
    }

    // Write the updated content back to the file
    await fs.writeFile(filePath, content, 'utf8');

    res.json({
      success: true,
      message: 'File updated successfully',
      updatedAt: newDate,
    });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating file',
      error: error.message,
    });
  }
});

app.post('/stop', async (req, res) => {
  const { port: portToStop } = req.body;
  try {
    await killProcessOnPort(portToStop);
    res.json({
      success: true,
      message: `Process on port ${portToStop} stopped`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error stopping process on port ${portToStop}: ${error.message}`,
    });
  }
});

app.post('/start-fe-dev-server', (req, res) => {
  const { entry, api } = req.body;
  const root = path.resolve(__dirname, '..', '..', '..', '..', '..');
  const name = 'fe-dev-server';
  const command = 'yarn';
  const args = [
    '--cwd',
    root,
    'watch',
    '--env',
    `entry=${entry}`,
    `api=${api}`,
  ];

  const result = startProcess(name, command, args);
  res.json(result);
});

// Modified endpoint for starting the mock server
app.post('/start-mock-server', (req, res) => {
  // get path to root of the repo
  const root = path.resolve(__dirname, '..', '..', '..');
  console.log({ root });
  const { debug = true, responsesPath } = req.body;
  const name = 'mock-server';
  const command = 'node';
  const args = [
    'src/platform/testing/e2e/mockapi.js',
    '--responses',
    responsesPath,
  ];
  const env = { AEDEBUG: debug.toString() };

  const result = startProcess(name, command, args, env);
  res.json(result);
});

app.get('/output/:name', (req, res) => {
  const { name } = req.params;
  if (outputCache[name]) {
    res.json(outputCache[name]);
  } else {
    res
      .status(404)
      .json({ error: `No output cache found for process ${name}` });
  }
});

app.get('/events/:name', (req, res) => {
  const { name } = req.params;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // Send the current cache immediately
  if (outputCache[name]) {
    sendSSE(res, { type: 'cache', data: outputCache[name] });
  }

  // Add this client to the list of clients for this process
  if (!clients.has(name)) {
    clients.set(name, []);
  }
  clients.get(name).push(res);

  // Remove the client when the connection is closed
  req.on('close', () => {
    const clientsForProcess = clients.get(name) || [];
    const index = clientsForProcess.indexOf(res);
    if (index !== -1) {
      clientsForProcess.splice(index, 1);
    }
  });
});

app.listen(port, () => {
  console.log(`Process manager server listening at http://localhost:${port}`);
  killProcessOnPort('3000');
  killProcessOnPort('3001');
  autoStartServers();
});
