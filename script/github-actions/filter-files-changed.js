const args = process.argv.slice(2);
const files = args[0].slice(1, -1).split(','); // remove unnecessary characters
const filteredFiles = files.filter(file => /.+\.jsx?$/.test(file)).join(' ');

console.log(`::set-output name=FILES::${filteredFiles}`); // eslint-disable-line no-console
