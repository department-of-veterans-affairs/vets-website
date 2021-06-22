/* eslint-disable no-console */
const chalk = require('chalk');
const commandLineArgs = require('command-line-args');
const fs = require('fs');
const glob = require('glob');
const replacements = require('./transformers');

const optionDefinitions = [
  { name: 'component', alias: 'c' },
  { name: 'dir', alias: 'd' },
];
const options = commandLineArgs(optionDefinitions);

const FILENAMES = glob.sync(`${options.dir}/**/*.jsx`);

const legacyImport = `import ${
  options.component
} from '@department-of-veterans-affairs/component-library/${
  options.component
}'`;

function handleError(error) {
  console.log(error);
}

function translateProps(componentString, propMap) {
  let translatedComp = componentString;

  Object.entries(propMap)
    .sort((pairOne, _) => {
      const children = ['content', 'children'];
      if (children.includes(pairOne[0])) return -1;
      return 1;
    })
    .forEach(([prop, newValue]) => {
      switch (typeof newValue) {
        case 'string':
          translatedComp = translatedComp.replace(prop, newValue);
          break;
        case 'function':
          translatedComp = newValue(translatedComp, prop);
          break;
        default:
          break;
      }
    });

  return translatedComp;
}

function replaceTags(file, newTag) {
  const unnamedClosingTags = file.matchAll(
    new RegExp(`(<${options.component}.+?(^\\s+)?\\/>;?$)`, 'gsm'),
  );

  const matches = Array.from(unnamedClosingTags, m => m[0]);

  let namedClosingTags = file;
  matches.forEach(match => {
    namedClosingTags = namedClosingTags.replace(
      match,
      match?.replace(/\s+\/>;?$/m, `></${newTag}>`),
    );
  });

  return namedClosingTags
    .replace(new RegExp(`<${options.component}`, 'g'), `<${newTag}`)
    .replace(`</${options.component}`, `</${newTag}`);
}

function migrateFile(fname, data) {
  console.log(chalk.cyan(`Reading ${fname}`));
  const [newTag, propMap] = replacements[options.component]();

  let migratedFile = data;

  migratedFile = replaceTags(migratedFile, newTag);

  const cmpRegex = new RegExp(`(<${newTag}.+?</${newTag}>)`, 'gsm');
  const components = Array.from(migratedFile.matchAll(cmpRegex), m => m[0]);

  console.log(
    chalk.magenta(`${options.component} found ${components.length} times.`),
  );
  components.forEach(component => {
    console.log(chalk.yellow.bold('Remapping component props:'));
    console.log(chalk.yellow(component));

    // Next, replace the props
    migratedFile = migratedFile.replace(
      component,
      translateProps(component, propMap),
    );
  });

  migratedFile = migratedFile.replace(legacyImport, '');

  fs.writeFile(fname, migratedFile, 'utf8', error => {
    if (error) handleError(error);
    console.log(chalk.green(`File written: ${fname}`));
  });

  console.log();
  return 0;
}

FILENAMES.forEach(fname => {
  fs.readFile(fname, 'utf8', (err, data) => {
    if (err) {
      return handleError(err);
    }
    if (!data.includes(legacyImport)) return null;
    // Leave this file alone if it doesn't import the component
    return migrateFile(fname, data);
  });
});
