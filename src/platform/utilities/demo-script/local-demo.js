/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');

const args = commandLineArgs([{ name: 'from', type: Number }]);
const n = args.from ?? 5;

for (let i = 0; i < n; i++) {
  console.log(n - i);
}
console.log('Hello world!!\nLocal src/platform/utilities demo script!!');
