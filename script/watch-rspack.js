const argv = require('minimist')(process.argv.slice(2));
const printBuildHelp = require('./build-help');
const { runCommand } = require('./utils');

// Preset memory options 1gb -> 12gb
const memoryOptions = [1024, 2048, 3072, 4096, 5120, 6144, 7168, 8192, 12288];

// Caching the input memory arg
const memorySet = argv.env ? argv.env.memory : null;

// Default memory setting
let memory = '12288';

// If the value passed isn't in the memoryOptions, use default
if (memorySet && memoryOptions.includes(memorySet)) {
  memory = memorySet;
}

// Building the watch command using rspack serve
const watchCommand = `NODE_OPTIONS='--max-old-space-size=${memory}' npx rspack serve --config config/rspack.config.js --env scaffold --env watch ${process.argv
  .slice(2)
  .join(' ')}`;

// If help, echo the options
if (process.argv[2] === 'help') {
  printBuildHelp();
  process.exit(0);
}

// Run the command
runCommand(watchCommand);
