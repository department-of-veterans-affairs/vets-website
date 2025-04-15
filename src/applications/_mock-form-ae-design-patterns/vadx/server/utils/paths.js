const path = require('path');
const fs = require('fs');

const findRoot = startDir => {
  let currentDir = startDir;

  // Walk up the directory tree until we find package.json or hit the root
  while (currentDir !== path.parse(currentDir).root) {
    const pkgPath = path.join(currentDir, 'package.json');

    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        // Verify this is the right package.json
        if (pkg.name === 'vets-website') {
          return currentDir;
        }
      } catch (e) {
        // Continue if package.json is invalid
      }
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error('Could not find vets-website root directory');
};

// Get absolute paths that can be used anywhere
const paths = {
  root: findRoot(__dirname),
  get applications() {
    return path.join(this.root, 'src/applications');
  },
  get mockApi() {
    return path.join(this.root, 'src/platform/testing/e2e/mockapi.js');
  },
};

module.exports = paths;
