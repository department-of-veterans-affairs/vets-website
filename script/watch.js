const printBuildHelp = require('./build-help');
const { runCommand } = require('./utils');

// If help, echo the options
if (process.argv[2] === 'help') {
  printBuildHelp();
  process.exit(0);
}

// Otherwise, run the command
runCommand(
  `NODE_OPTIONS=--max-old-space-size=4096 webpack-dev-server --config config/webpack.config.js --env.watch=true --progress ${process.argv
    .slice(2)
    .join(' ')}`,
);
