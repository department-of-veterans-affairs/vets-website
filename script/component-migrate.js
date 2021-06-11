/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const fs = require('fs');
const glob = require('glob');

const optionDefinitions = [
  { name: 'component', alias: 'c' },
  { name: 'dir', alias: 'd' },
];

function alertBoxReplacement() {
  return ['va-alert'];
}

function handleError(error) {
  console.log(error);
}

const replacements = {
  AlertBox: alertBoxReplacement,
};

const options = commandLineArgs(optionDefinitions);

const legacyImport = `@department-of-veterans-affairs/component-library/${
  options.component
}`;

const filenames = glob.sync(`${options.dir}/**/*.jsx`);

filenames.forEach(fname => {
  fs.readFile(fname, 'utf8', (err, data) => {
    if (err) {
      handleError(err);
    }

    // Leave this file alone if it doesn't import the component
    if (!data.includes(legacyImport)) return null;

    const unnamedClosingTags = data.matchAll(
      new RegExp(`(<${options.component}.+?</>)`, 'gs'),
    );
    const cmpUnnamedClosingTag = [...unnamedClosingTags][0]?.[0];

    // [...unnamedClosingTags][0]?.[0].replace("</>". `${op
    // const cmpRegex = hasNamedClosingTag ? data.match(new Regex(`<${options.component}`)) :
    // const component =

    // First, replace the tags
    const [newTag] = replacements[options.component]();
    const dataWithNamedClosingTags = data.replace(
      cmpUnnamedClosingTag,
      cmpUnnamedClosingTag?.replace('</>', `</${newTag}>`),
    );

    const newTags = dataWithNamedClosingTags
      .replace(`<${options.component}`, `<${newTag}`)
      .replace(`</${options.component}`, `</${newTag}`);

    // Next, replace the props

    fs.writeFile(fname, newTags, 'utf8', handleError);

    return 0;
  });
});
