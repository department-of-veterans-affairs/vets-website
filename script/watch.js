const printBuildHelp = require('./build-help');
const { runCommand } = require('./utils');
const argv = require('minimist')(process.argv.slice(2));

// Preset memory options 1gb -> 8gb
const memoryOptions = [1024, 2048, 3072, 4096, 5120, 6144, 7168, 8192];

// Caching the input memory arg
const memorySet = argv.env ? argv.env.memory : null;

// Default memory setting
let memory = '8192';

// If the value passed isn't in the memoryOptions, use default
if (memorySet && memoryOptions.includes(memorySet)) {
  memory = memorySet;
}

// Building the watch commmand
const watchCommand = `NODE_OPTIONS=--max-old-space-size=${memory} webpack serve --config config/webpack.config.js --env scaffold ${process.argv
  .slice(2)
  .join(' ')}`;

// If help, echo the options
if (process.argv[2] === 'help') {
  printBuildHelp();
  process.exit(0);
}

// Run the command
runCommand(watchCommand);
