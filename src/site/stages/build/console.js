/* eslint-disable no-console */

let alreadyOverloaded = false;
let consoleDirty = false;

/**
 * Replace the process.stdout.write and process.stderr.out with a simple wrapper
 * which toggles consoleDirty to true. This is because we only need to write the
 * full logStepEnd if there's any output after the logStepStart.
 */
function overloadConsoleWrites() {
  if (!alreadyOverloaded) {
    alreadyOverloaded = true;
    console.log('overloading terminal writes');
    process.stdout.__write = process.stdout.write;
    process.stdout.write = function _write(...params) {
      consoleDirty = true;
      process.stdout.__write(...params);
    };
    process.stderr.__write = process.stderr.write;
    process.stderr.write = function _write(...params) {
      consoleDirty = true;
      process.stderr.__write(...params);
    };
  }
}

const isConsoleDirty = () => consoleDirty;

function cleanConsole() {
  consoleDirty = false;
}

module.exports = {
  overloadConsoleWrites,
  isConsoleDirty,
  cleanConsole,
};
