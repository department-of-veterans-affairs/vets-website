const chokidar = require('chokidar');
const chalk = require('chalk');
const getOptions = require('../src/site/stages/build/options');
const build = require('../src/site/stages/build');

async function buildContent() {
  const buildOptions = await getOptions();

  const rebuild = (event, path) => {
    // eslint-disable-next-line no-console
    console.log(
      `Rebuilding content. Reason: ${chalk.green(event)} ${chalk.blue(path)}`,
    );
    build(buildOptions);
  };

  if (buildOptions.watch) {
    chokidar
      .watch(buildOptions.watchPaths)
      .on('ready', () => {
        build(buildOptions);
      })
      .on('add', rebuild)
      .on('change', rebuild)
      .on('unlink', rebuild);
  } else {
    build(buildOptions);
  }
}

buildContent();
