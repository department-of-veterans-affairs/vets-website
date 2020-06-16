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
    /* eslint-disable no-console */
    log: message => console.log(message) || null,
    table: message => console.table(message) || null,
    /* eslint-enable no-console */

    /**
     * Sets up specified target files or directories as temporary fixtures
     * by creating symlinks under a temp directory in the fixtures folder.
     *
     * THIS SHOULD ONLY BE INVOKED VIA CY.SYNCFIXTURES, NEVER DIRECTLY.
     *
     * @param {object} args
     * @param {object} args.fixtures - Mapping of fixture paths to target paths.
     * @param {string} [args.dir] - Path under fixtures folder
     *     where fixtures will be synced.
     * @param {boolean} [args.initialized] - Flag to indicate whether
     *     synced fixtures have been initialized. If uninitialized,
     *     temp dir will get cleaned upon initialization.
     */
    _syncFixtures: ({ fixtures, dir = 'tmp', initialized = false }) => {
      const TMP_FIXTURES_PATH = `cypress/fixtures/${dir}`;

      if (!initialized) {
        // Wipe existing fixtures and recreate tmp dir for a clean state.
        fs.rmdirSync(TMP_FIXTURES_PATH, { recursive: true });
        fs.mkdirSync(TMP_FIXTURES_PATH, { recursive: true });
      }

      for (const [key, target] of Object.entries(fixtures)) {
        const targetPath = path.resolve(target);

        if (!fs.existsSync(targetPath)) {
          throw new Error(`Target path "${targetPath}" doesn't exist`);
        }

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

        // Link the fixture to the target.
        fs.symlinkSync(targetPath, fixturePath);
      }

      return dir;
    },
  });
};
