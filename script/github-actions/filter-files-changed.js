const args = process.argv.slice(2);
const FILES = args[0].slice(1, -1).split(','); // remove unnecessary characters
let lintFiles = '';

FILES.forEach(file => {
  const fileExt = file.split('.').pop();
  if (fileExt === 'js' || fileExt === 'jsx') {
    lintFiles += `${file} `;
  }
});

console.log(`::set-output name=FILES::${lintFiles}`); // eslint-disable-line no-console
