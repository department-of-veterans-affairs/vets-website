const fs = require('fs');
const path = require('path');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = on => {
  const ENV = 'localhost';

  const options = {
    webpackOptions: {
      // Import our own Webpack config.
      ...require('../../../../../../config/webpack.config.js')(ENV),

      // Expose some Node globals.
      node: {
        __dirname: true,
        __filename: true,
      },
    },
  };

  on('file:preprocessor', webpackPreprocessor(options));

  on('task', {
    /**
     * Sets up specified target files or directories as Cypress fixtures
     * by creating symlinks under a temp path in the fixtures folder.
     * This should only be invoked via `cy.syncFixtures`, not directly.
     *
     * @param {object} fixtures - A map of fixture paths to target paths.
     */
    _syncFixtures: fixtures => {
      const TMP_FIXTURES_PATH = 'cypress/fixtures/tmp';

      // Wipe existing fixtures and recreate tmp dir for a clean state.
      fs.rmdirSync(TMP_FIXTURES_PATH, { recursive: true });
      fs.mkdirSync(TMP_FIXTURES_PATH, { recursive: true });

      for (const [key, target] of Object.entries(fixtures)) {
        /**
         * Check for path conflicts while building out the fixture path.
         * This can conflict with another defined fixture path in two ways:
         *
         * 1. If this fixture path includes a symlink, which would only exist
         *    in the tmp dir as a result of creating another fixture path.
         * 2. Or if something already exists at this fixture path.
         */
        const fixturePath = key.split(path.sep).reduce((acc, cur, idx, src) => {
          const p = path.join(acc, cur);

          if (fs.existsSync(p)) {
            if (idx === src.length - 1 || fs.lstatSync(p).isSymbolicLink()) {
              throw new Error(
                `Fixture path "${key}" conflicts with another fixture path at "${cur}"`,
              );
            }
          } else if (idx < src.length - 1) {
            fs.mkdirSync(p);
          }

          return p;
        }, TMP_FIXTURES_PATH);

        const targetPath = path.resolve(target);

        if (!fs.existsSync(targetPath)) {
          throw new Error(`Target path "${targetPath}" doesn't exist`);
        }

        // Link the fixture to the target.
        fs.symlinkSync(targetPath, fixturePath);
      }

      return null;
    },
  });
};
