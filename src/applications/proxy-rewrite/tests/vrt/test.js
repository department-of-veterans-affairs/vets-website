const fetch = require('node-fetch');

console.log('test2');
async function main() {
  const response = await fetch('http://chrome:9222');
  const json = await response.json();
  console.log(json);
}

setTimeout(main, 30000);
