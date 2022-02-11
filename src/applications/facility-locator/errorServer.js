// This is a simple utility to simulate error responses from the API.
// To use it, simply run "node src/applications/facility-locator/errorServer.js"
// with your API URL set to localhost:3000 (which is the default for local development).

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.write('error');
  res.end();
});

server.listen(3000);

// eslint-disable-next-line no-console
console.log(
  'Error server running on port 3000. Proudly serving errors since 2021!',
);
