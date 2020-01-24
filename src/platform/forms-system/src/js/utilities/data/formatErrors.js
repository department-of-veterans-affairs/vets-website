// Process JSON-schema error messages for viewing

// Change error message from `requires property "someCamelCasedProperty"` to
// `We’re missing some camel cased property`. It's using the schema property
// name, which isn't ideal, because the uiSchema may have an empty title and/or
// description
const formatErrors = message =>
  message
    .replace(/instance(\.\w+|\s)?/, '')
    .replace(/(view:|ui:|")/g, '')
    .replace('requires property ', 'We’re missing ')
    .replace(/[A-Z]/g, str => ` ${str.toLowerCase()}`)
    .trim()
    .replace(/^./, str => str.toUpperCase());

// min/max length or item errors may show up as duplicates
const errorExists = (acc, name) => acc.find(obj => obj.name === name);

// Find the chapter name that contains the property (name) which is used to
// build a link that will expand the associated accordion when clicked
const getChapterNameIndex = (chapters = {}, name, instance = '') => {
  const find = (obj, insideInstance = false) => {
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).find(key => {
        // these keys may contain all properties, or are react components
        if (
          key === 'schema' ||
          key === 'initialData' ||
          key.startsWith('ui:')
        ) {
          return false;
        }
        if (obj[name]) {
          return !instance || insideInstance;
        }
        return find(obj[key], insideInstance || key === instance);
      });
    }
    return false;
  };
  return Object.keys(chapters).findIndex(chapter =>
    find(chapters[chapter].pages),
  );
};

/* There are three types of Validation error messages:
 * min/max: {
    property: 'instance.someProperty',
    message: 'does not meet minimum length of 1',
    name: 'minItems',
    argument: 1,
    schema: {...},
    stack: 'instance.someProperty does not meet minimum length of 1'
  }
  * required: {
    property: 'instance',
    message: 'requires property "someProperty"',
    name: 'required',
    argument: 'someProperty',
    schema: {...},
    stack: 'instance requires property "someProperty"'
  }
  * non-empty "__errors" array: {
    __errors: ['error message']
  }
*/
export const reduceErrors = (errors, { chapters }) =>
  errors.reduce((acc, error) => {
    const findErrors = (key, err) => {
      if (typeof err === 'object') {
        if (err.message) {
          const instance = err.property.replace('instance.', '');
          const name = err.name === 'required' ? err.argument : instance;
          /*
           * There may be multiple errors for the same property, e.g.
           * `contestedIssues` in form 996. It can have a custom message
           * "Please select a contested issue" and a minItem error
           * "Does not meet minimum length of 1"; there's no need to confuse
           * anyone and show both
          */
          if (!errorExists(acc, name)) {
            const index = getChapterNameIndex(
              chapters,
              err.argument,
              err.property.startsWith('instance.') ? instance : '',
            );
            acc.push({
              name,
              message: formatErrors(err.stack),
              chapter: Object.keys(chapters)[index] || '',
              index,
            });
          }
          return null;
        }
        if (err.__errors && err.__errors.length && !errorExists(acc, key)) {
          const index = getChapterNameIndex(chapters, key);
          acc.push({
            name: key,
            message: err.__errors.map(e => formatErrors(e)).join('. '),
            chapter: Object.keys(chapters)[index] || '',
            index,
          });
        }
        Object.keys(err).forEach(sub => findErrors(sub, err[sub]));
      }
      return null;
    };
    findErrors('', error);
    return acc;
  }, []);
