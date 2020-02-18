import numberToWords from './numberToWords';
// Process JSON-schema error messages for viewing

// Change React-JSON-schema hard-coded error messages. For example, chabnge
// `requires property "someCamelCasedProperty1"` to `Some camel cased property 1`
// Array type properties need to get special treatment,
// `"instance.newDisabilities[0] requires property "cause"` is modified into
// `First new disabilities cause`. Both methods use the schema property name,
// which isn't ideal, because the uiSchema may have an empty title and/or
// description
const formatErrors = message =>
  message
    .replace(/(requires property|instance\.?)\s*/g, '')
    .replace(/(view:|ui:|")/g, '')
    // convert array numbering `test[1]` to a numbered word `first test`
    .replace(
      /(\w+)(\[\d+\])/,
      (_, word, number) => `${numberToWords(number, +1)} ${word}`,
    )
    // Change camel case variable names into something readable.
    .replace(/[A-Z]/g, str => ` ${str.toLowerCase()}`)
    // Separate numbers (e.g. "address1" -> "address 1")
    .replace(/([a-z])(\d)/g, '$1 $2')
    // "zip" code replaced with "postal" code in content, but not property names
    .replace(/zip\s(code)?/i, 'postal code')
    // Make abbreviations upper case
    .replace(/\b(va|pow)\b/g, str => ` ${str.toUpperCase()} `)
    .trim()
    .replace(/^./, str => str.toUpperCase());

// min/max length or item errors may show up as duplicates
const errorExists = (acc, name) => acc.find(obj => obj.name === name);

// Keys to ignore within the pageList objects & pageList schema
const ignoreKeys = [
  'title',
  'path',
  'depends',
  'schema',
  'chapterTitle',
  'chapterKey',
  'pageKey',
  'type',
  'required',
  'initialData',
];

// Find the chapter and page name that contains the property (name) which is
// used to build a link that will expand the associated accordion when clicked
const getPropertyInfo = (pageList = [], name, instance = '') => {
  const findPageIndex = (obj, insideInstance = instance === '') => {
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).findIndex(key => {
        if (ignoreKeys.includes(key) || key.startsWith('ui:')) {
          return false;
        }
        if (insideInstance && name === key && obj[name]) {
          return true;
        }
        return findPageIndex(obj[key], insideInstance || key === instance) > -1;
      });
    }
    return -1;
  };
  return pageList.find(page => findPageIndex(page) > -1) || {};
};

/* There are four types of hardcoded validation error messages in the form system:
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
  * array: {
    property: 'instance.newDisabilities[0]',
    message: 'requires property "cause"',
    name: 'required',
    argument: 'cause',
    schema: {...},
    stack: 'instance.newDisabilities[0] requires property "cause"'
  }
  * non-empty "__errors" array: {
    __errors: ['error message']
  }
*/
export const reduceErrors = (errors, pageList) =>
  errors.reduce((acc, error) => {
    const findErrors = (key, err) => {
      if (typeof err === 'object') {
        if (err.message) {
          const property = err.property.replace(/instance\.?/, '') || '';
          const instance = property.replace(/(\[\d+\])/, '');
          const name = err.name === 'required' ? err.argument : instance;
          /*
           * There may be multiple errors for the same property, e.g.
           * `contestedIssues` in form 996. It can have a custom message
           * "Please select a contested issue" and a minItem error
           * "Does not meet minimum length of 1"; there's no need to confuse
           * anyone and show both
          */
          if (!errorExists(acc, name)) {
            const { chapterKey = '', pageKey = '' } = getPropertyInfo(
              pageList,
              err.argument,
              err.property.startsWith('instance.') ? instance : '',
            );
            acc.push({
              name,
              // property may be `array[0]`; we need to extract out the `[0]`
              index: property.match(/\[(\d+)\]/)?.[1] || null,
              message: formatErrors(err.stack),
              chapterKey,
              pageKey,
            });
          }
          return null;
        }
        if (err.__errors && err.__errors.length && !errorExists(acc, key)) {
          const { chapterKey = '', pageKey = '' } = getPropertyInfo(
            pageList,
            key,
          );
          acc.push({
            name: key,
            index: null,
            message: err.__errors.map(e => formatErrors(e)).join('. '),
            chapterKey,
            pageKey,
          });
        }
        Object.keys(err).forEach(sub => findErrors(sub, err[sub]));
      }
      return null;
    };
    findErrors('', error);
    return acc;
  }, []);
