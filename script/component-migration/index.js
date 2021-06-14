/* eslint-disable no-console */
const commandLineArgs = require('command-line-args');
const fs = require('fs');
const glob = require('glob');

const optionDefinitions = [
  { name: 'component', alias: 'c' },
  { name: 'dir', alias: 'd' },
];
const options = commandLineArgs(optionDefinitions);

const legacyImport = `@department-of-veterans-affairs/component-library/${
  options.component
}`;

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

/*
 **********************************
 *    Component transformers      *
 **********************************
 */
function alertBoxReplacement() {
  const moveToNamedSlot = componentString => {
    let translatedHeadline = componentString.toString();
    const level = componentString.match(/level=["{](\d)["}]/)?.[1] || 3;
    /* eslint-disable-next-line no-useless-escape */
    const headline = componentString.match(/headline=["{]([\w\s\.]+)["}]/)?.[1];
    translatedHeadline = translatedHeadline.replace(/level=["{](\d)["}]/, '');
    translatedHeadline = translatedHeadline.replace(
      /headline=["{](.)+["}]/,
      '',
    );

    const childrenStart = translatedHeadline.indexOf('>') + 1;
    translatedHeadline = `
      ${translatedHeadline.slice(0, childrenStart)}
      <h${level} slot="headline">${headline}</h${level}>
      ${translatedHeadline.slice(childrenStart)}
      `;
    return translatedHeadline;
  };

  const moveChildren = (componentString, propName) => {
    let translatedChildren = componentString.toString();
    const tag = [...componentString.match(/<(va-[a-z-]+)\s/)][1];
    const children = componentString.match(
      new RegExp(`${propName}={(.+)}`, 's'),
    )?.[1];

    if (!children) return componentString;

    translatedChildren = translatedChildren.replace(
      `></${tag}`,
      `>\n${children}\n</${tag}`,
    );

    translatedChildren = translatedChildren.replace(children, '');
    translatedChildren = translatedChildren.replace(`${propName}={}\n`, '');
    return translatedChildren;
  };

  return [
    'va-alert',
    {
      headline: moveToNamedSlot,
      content: moveChildren,
      // children: moveChildren,
      // level: null,
      isVisible: 'visible',
    },
  ];
}

const replacements = {
  AlertBox: alertBoxReplacement,
};

/* End of component transformers */

const filenames = glob.sync(`${options.dir}/**/*.jsx`);

filenames.forEach(fname => {
  fs.readFile(fname, 'utf8', (err, data) => {
    if (err) {
      return handleError(err);
    }

    // Leave this file alone if it doesn't import the component
    if (!data.includes(legacyImport)) return null;

    const unnamedClosingTags = data.matchAll(
      new RegExp(`(<${options.component}.+?\\s\\/>)`, 'gsm'),
    );
    const cmpUnnamedClosingTag = [...unnamedClosingTags][0]?.[0];

    // First, replace the tags
    const [newTag, propMap] = replacements[options.component]();
    const dataWithNamedClosingTags = data.replace(
      cmpUnnamedClosingTag,
      cmpUnnamedClosingTag?.replace(/\s\/>/, `></${newTag}>`),
    );

    const newTags = dataWithNamedClosingTags
      .replace(`<${options.component}`, `<${newTag}`)
      .replace(`</${options.component}`, `</${newTag}`);

    const cmpRegex = new RegExp(`<${newTag}.+</${newTag}>`, 'gs');
    const components = newTags.matchAll(cmpRegex);

    const component = [...components][0][0];

    // Next, replace the props
    const migratedComponent = newTags.replace(
      component,
      translateProps(component, propMap),
    );

    fs.writeFile(fname, migratedComponent, 'utf8', handleError);

    return 0;
  });
});
