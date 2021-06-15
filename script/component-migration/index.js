/* eslint-disable no-console */
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
  // Make a copy so we don't modify the reference
  let translatedComp = componentString.toString();

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
    new RegExp(`(<${options.component}.+?^\\s+\\/>)`, 'gsm'),
  );
  const cmpUnnamedClosingTag = [...unnamedClosingTags][0]?.[0];

  // First, replace the tags
  const dataWithNamedClosingTags = file.replace(
    cmpUnnamedClosingTag,
    cmpUnnamedClosingTag?.replace(/^\s+\/>/m, `></${newTag}>`),
  );

  return dataWithNamedClosingTags
    .replace(`<${options.component}`, `<${newTag}`)
    .replace(`</${options.component}`, `</${newTag}`);
}

FILENAMES.forEach(fname => {
  fs.readFile(fname, 'utf8', (err, data) => {
    if (err) {
      return handleError(err);
    }

    // Leave this file alone if it doesn't import the component
    if (!data.includes(legacyImport)) return null;
    const [newTag, propMap] = replacements[options.component]();

    const newTags = replaceTags(data, newTag);

    const cmpRegex = new RegExp(`<${newTag}.+</${newTag}>`, 'gs');
    const components = newTags.matchAll(cmpRegex);

    const component = [...components][0][0];

    // Next, replace the props
    const migratedComponent = newTags.replace(
      component,
      translateProps(component, propMap),
    );

    const removeImport = migratedComponent.replace(legacyImport, '');

    fs.writeFile(fname, removeImport, 'utf8', handleError);

    return 0;
  });
});
