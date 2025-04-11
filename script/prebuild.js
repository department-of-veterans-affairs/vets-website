const semver = require('semver');
const fs = require('fs');
const path = require('path');

// Debug: Verify where semver is resolved from
// eslint-disable-next-line no-console
console.log('Resolved semver from:', require.resolve('semver'));

const nodeVersion = path.join(__dirname, '../.nvmrc');
const minimumNodeVersion = fs.readFileSync(nodeVersion).toString();

if (process.env.INSTALL_HOOKS !== 'no') {
  // Make sure git pre-commit hooks are installed
  ['pre-commit'].forEach(hook => {
    const src = path.join(__dirname, `hooks/${hook}`);
    const dest = path.join(__dirname, `../.git/hooks/${hook}`);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      // Install hooks
      fs.linkSync(src, dest);
    }
  });
}

if (semver.compare(process.version, minimumNodeVersion) === -1) {
  process.stdout.write(`Node.js version (minimum): v${minimumNodeVersion}\n`);
  process.stdout.write(`Node.js version (installed): ${process.version}\n`);
  process.exit(1);
}
