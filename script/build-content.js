const chokidar = require('chokidar');
const chalk = require('chalk');
const debounce = require('lodash/debounce');

const getOptions = require('../src/site/stages/build/options');
const build = require('../src/site/stages/build');

async function buildContent() {
  const buildOptions = await getOptions();

  const rebuild = debounce((event, path) => {
    // eslint-disable-next-line no-console
    console.log(
      `Rebuilding content. Reason: ${chalk.green(event)} ${chalk.blue(path)}`,
    );
    build(buildOptions);
  }, 10);

  if (buildOptions.watch) {
    chokidar
      .watch(buildOptions.watchPaths, { ignoreInitial: true })
      .on(
        'ready',
        // chokidar was emitting ready twice; debouncing so we don't build twice...
        debounce(() => {
          build(buildOptions);
        }, 10),
      )
      .on('add', rebuild)
      .on('change', rebuild)
      .on('unlink', rebuild);
  } else {
    build(buildOptions);
  }
}

buildContent();
