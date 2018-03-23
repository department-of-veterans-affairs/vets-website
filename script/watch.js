const chokidar = require('chokidar');
const CLIEngine = require('eslint').CLIEngine;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const esLinter = new CLIEngine();
const sasslinter = require('sass-lint');

const chalk = require('chalk');
const path = require('path');
const srcWatcher = chokidar.watch(['./src/**/*.jsx', './src/**/*.js', './src/**/*.scss']);

let running = false;
let restart = false;

function formatter(eslintResults) {
  return eslintResults.reduce((acc, current) => {
    acc.push(chalk.cyan(`${path.basename(current.filePath)}\n`));
    current.messages.forEach((message) => {
      acc.push(chalk.cyan(`  line ${message.line} `));
      acc.push(chalk.red(`${message.message}\n`));
    });
    return acc;
  }, [])
};

async function getChangedFiles() {
  const gitDiffIndex = await exec('git diff-index --name-only HEAD');
  return gitDiffIndex.stdout.split('\n');
}

async function runLints() {
  console.log('runLints');
  if (running) {
    restart = true;
    return;
  } else {
    running = true;
    restart = false;
  }

  process.stdout.write('\033c');
  console.log(chalk.yellow(`Change detected- running lints ${new Date().toLocaleTimeString()}`));

  const changedFiles = await getChangedFiles();

  if (restart) {
    restart = false;
    running = true;
    return runLints();
  }

  const filesByLinter = changedFiles.reduce((groupedFiles, changedFile) => {
    switch(path.extname(changedFile)) {
      case '.js':
      case '.jsx':
        groupedFiles.esLintable.push(changedFile);
        break;
      case '.scss':
        groupedFiles.sasslintable.push(changedFile);
        break;
      default:
    }
    return groupedFiles;

  }, { esLintable: [], sasslintable: [] } );

  if (restart) {
    restart = false;
    running = true;
    return runLints();
  }

  filesByLinter.esLintable.forEach((esFile) => {
    const eslintResults = esLinter.executeOnFiles([esFile]).results;
    if (eslintResults.errorCount > 0)  {
      console.log(...formatter(eslintResults));
    } else {
      console.log(chalk.green(`${path.basename(esFile)} - lint free`)); }
  });

  filesByLinter.sasslintable.forEach((sassFile) => {
    const sasslintResults = sasslinter.lintFiles(`./${sassFile}`, {}, './config/sass-lint.yml');
    if (sasslintResults.errorCount > 0)  {
      console.log(...formatter(sasslintResults));
    } else {
      console.log(chalk.green(`${path.basename(sassFile)} - lint free`));
    }
  });

  running = false;

  if (restart) {
    runLints();
    restart = false;
    return;
  }

  restart = false;
}

console.log('watch started');
runLints();
