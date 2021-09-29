const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(400, { 'Content-Type': 'text/html' });
  res.write('error');
  res.end();
});

server.listen(3000);

// eslint-disable-next-line no-console
console.log('Fake API server running on port 3000');
