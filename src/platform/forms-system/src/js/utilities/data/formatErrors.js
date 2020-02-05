// Process JSON-schema error messages for viewing

// Change error message from `requires property "someCamelCasedProperty"` to
// `We’re missing some camel cased property`. It's using the schema property
// name, which isn't ideal, because the uiSchema may have an empty title and/or
// description
const formatErrors = message =>
  message
    .replace(/instance(\.\w+|\s)?/, '')
    .replace(/(view:|ui:|")/g, '')
    .replace('requires property ', 'Missing ')
    // Include numbers (e.g. "addressLine1" -> "address line 1")
    .replace(/[A-Z\d]/g, str => ` ${str.toLowerCase()}`)
    // "zip" code replaced with "postal" code in content, but not property names
    .replace(/zip\s(code)?/i, 'postal code')
    .replace(' va ', ' VA ')
    .trim()
    .replace(/^./, str => str.toUpperCase());

// min/max length or item errors may show up as duplicates
const errorExists = (acc, name) => acc.find(obj => obj.name === name);

// Find the chapter and page name that contains the property (name) which is
// used to build a link that will expand the associated accordion when clicked
const getPropertyInfo = (chapters = {}, name, instance = '') => {
  let page;
  const find = (obj, insideInstance = false, pageName) => {
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).reduce(
        (acc, key) => {
          // these keys may contain all properties, or are react components
          if (
            acc.found ||
            key === 'schema' ||
            key === 'initialData' ||
            key.startsWith('ui:')
          ) {
            return acc;
          }
          if (name === key && obj[name]) {
            if (!acc.pageName) {
              const pName = pageName || key;
              acc.pageName = pName === 'uiSchema' ? '' : pName;
              acc.found = !instance || insideInstance;
            }
            return acc;
          }
          return find(
            obj[key],
            insideInstance || key === instance,
            pageName || key, // Keep a reference to the page name
          );
        },
        { found: false },
      );
    }
    return {};
  };
  const index = Object.keys(chapters).findIndex(chapter => {
    const { pageName = '', found = false } = find(
      chapters[chapter].pages,
      false,
    );
    if (found && !page) {
      page = pageName;
    }
    return found;
  });
  return { index, page };
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
            const { page = '', index } = getPropertyInfo(
              chapters,
              err.argument,
              err.property.startsWith('instance.') ? instance : '',
            );
            acc.push({
              name,
              message: formatErrors(err.stack),
              chapter: Object.keys(chapters)[index] || '',
              page,
              index,
            });
          }
          return null;
        }
        if (err.__errors && err.__errors.length && !errorExists(acc, key)) {
          const { page = '', index } = getPropertyInfo(chapters, key);
          acc.push({
            name: key,
            message: err.__errors.map(e => formatErrors(e)).join('. '),
            chapter: Object.keys(chapters)[index] || '',
            page,
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
