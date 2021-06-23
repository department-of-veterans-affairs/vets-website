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

  // We want any `children` or `content` props to be the first to migrate,
  // because not doing so can mess up the closing tags
  Object.entries(propMap)
    .sort(([prop, _value]) => {
      const children = ['content', 'children'];
      if (children.includes(prop)) return -1;
      return 1;
    })
    .forEach(([prop, newValue]) => {
      translatedComp =
        typeof newValue === 'function'
          ? newValue(translatedComp, prop)
          : translatedComp.replace(prop, newValue);
    });

  return translatedComp;
}

function replaceTags(fileContents, newTag) {
  const unnamedClosingTags = fileContents.matchAll(
    new RegExp(`(<${options.component}.+?(^\\s+)?\\/>;?$)`, 'gsm'),
  );

  const matches = Array.from(unnamedClosingTags, m => m[0]);

  const namedClosingTags = matches.reduce(
    (acc, match) =>
      acc.replace(match, match?.replace(/\s+\/>;?$/m, `></${newTag}>`)),
    fileContents,
  );

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
