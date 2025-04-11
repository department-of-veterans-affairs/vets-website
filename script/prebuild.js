import { compare } from 'semver';
import { readFileSync, existsSync, linkSync } from 'fs';
import { join } from 'path';

// Debug: Verify where semver is resolved from
// eslint-disable-next-line no-console
console.log('Resolved semver from:', require.resolve('semver'));

const nodeVersion = join(__dirname, '../.nvmrc');
const minimumNodeVersion = readFileSync(nodeVersion).toString();

if (process.env.INSTALL_HOOKS !== 'no') {
  // Make sure git pre-commit hooks are installed
  ['pre-commit'].forEach(hook => {
    const src = join(__dirname, `hooks/${hook}`);
    const dest = join(__dirname, `../.git/hooks/${hook}`);
    if (existsSync(src) && !existsSync(dest)) {
      // Install hooks
      linkSync(src, dest);
    }
  });
}

if (compare(process.version, minimumNodeVersion) === -1) {
  process.stdout.write(`Node.js version (minimum): v${minimumNodeVersion}\n`);
  process.stdout.write(`Node.js version (installed): ${process.version}\n`);
  process.exit(1);
}
