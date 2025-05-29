/* eslint-disable no-console */
const chalk = require('chalk');
const commandLineArgs = require('command-line-args');
const fs = require('fs');
const glob = require('glob');
const replacements = require('./transformers');
const printMigrationHelp = require('./migration-help');

const optionDefinitions = [
  { name: 'component', alias: 'c' },
  { name: 'dir', alias: 'd' },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
];
const options = commandLineArgs(optionDefinitions);

const legacyImport = `import ${options.component} from '@department-of-veterans-affairs/component-library/${options.component}'`;

function handleError(error) {
  console.log(error);
}

/**
 * Modify the `componentString` based on the prop map
 *
 * @param {string} componentString String of the component, from opening to closing tag
 * @param {Object} propMap Map of original prop name (key) to what the translated component should have instead
 */
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

/**
 * Replace the React component tags with the Web Component tag.
 * This works on single line components, multiline components, and
 * ones that don't have a closing tag as well as ones that do.
 *
 * @param {string} fileContents The contents of the file
 * @param {string} newTag The name of the Web Component tag to use
 */
function replaceTags(fileContents, newTag) {
  const unnamedClosingTags = fileContents.matchAll(
    new RegExp(
      `(<${options.component}(?!.*<\\/${options.component}>).*?(^\\s+)?\\/>;?$)`,
      'gsm',
    ),
  );

  const matches = Array.from(unnamedClosingTags, m => m[0]);

  const namedClosingTags = matches.reduce(
    (acc, match) =>
      acc.replace(match, match?.replace(/\s+\/>;?$/m, `></${newTag}>`)),
    fileContents,
  );

  return namedClosingTags
    .replace(new RegExp(`<${options.component}`, 'g'), `<${newTag}`)
    .replace(new RegExp(`</${options.component}`, 'g'), `</${newTag}`);
}

/**
 * Identify all occurrences of the component in the file and migrate them to the
 * Web Component version
 *
 * @param {string} fname Name of the file
 * @param {string} data Contents of the file
 */
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

function main() {
  // If the --help arg was passed or the dir + component args weren't passed
  // print the help and exit
  if (options.help || !options.dir || !options.component) {
    printMigrationHelp();
    process.exit(0);
  }

  const filenames = glob.sync(`${options.dir}/**/*.jsx`);

  // Loop through all files in the glob & migrate them if they are importing the --component
  filenames.forEach(fname => {
    fs.readFile(fname, 'utf8', (err, data) => {
      if (err) {
        return handleError(err);
      }
      if (!data.includes(legacyImport)) return null;
      // Leave this file alone if it doesn't import the component
      return migrateFile(fname, data);
    });
  });
}
main();
