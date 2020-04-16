const chokidar = require('chokidar');
const chalk = require('chalk');
const getOptions = require('../src/site/stages/build/options');
const build = require('../src/site/stages/build');

async function buildContent() {
  const buildOptions = await getOptions();

  if (buildOptions.watch) {
    chokidar
      .watch(buildOptions.watchPaths)
      .on('ready', () => {
        build(buildOptions);
      })
      .on('change', (event, path) => {
        // eslint-disable-next-line no-console
        console.log(
          `Rebuilding content. Reason: ${chalk.green(event)} ${chalk.blue(
            path,
          )}`,
        );
        build(buildOptions);
      });
  } else {
    build(buildOptions);
  }
}

buildContent();
