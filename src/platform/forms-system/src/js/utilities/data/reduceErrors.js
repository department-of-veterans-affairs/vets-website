// min/max length or item errors may show up as duplicates
const errorExists = (list, name) => list.some(obj => obj.name === name);

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

const isIgnoredSchemaKey = key =>
  key.startsWith('ui:') || ignoreKeys.includes(key);

// Find the chapter and page name that contains the property (name) which is
// used to build a link that will expand the associated accordion when clicked
const getPropertyInfo = (pageList = [], name, instance = '') => {
  const findPageIndex = (obj, insideInstance = instance === '') => {
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).findIndex(key => {
        if (isIgnoredSchemaKey(key)) {
          return false;
        }
        if (insideInstance && name === key && obj[name]) {
          return true;
        }
        return (
          findPageIndex(obj[key], insideInstance || instance.includes(key)) > -1
        );
      });
    }
    return -1;
  };
  return pageList.find(page => findPageIndex(page) > -1) || {};
};

/**
 * @typedef Form~errors
 * @type {object[]}
 * @property {string} name - form element name from uiSchema
 * @property {number|null} index - if the value is an array, this is the index
 * @property {string} message - processed error message
 * @property {string} chapterKey - the chapter the element is associated with
 * @property {string} pageKey - the page within the chapter the element is
 *   associated with
 */
/**
 * @typedef Form~rawErrors - list of raw errors that are output from jsonschema
 *   validator
 * @type {object}
 * @property {string} property - path within the page uiSchema that leds to the
 *   error. Always starts with "instance"
 * @property {string} message - specific error message. It may or may not
 *   include the property causing the error
 * @property {string} name - When provided, it includes the type of error, e.g.
 *   "required", "minItems", "maxItems", etc
 * @property {string|number} argument - name of the property or index in array
 *   with the validation error
 * @property {object} schema - schema of the page; ignored by this error reducer
 * @property {string} stack - error message used in processing; similar to the
 *   error message, but includes the path to the error
 * @property {string[]} __errors - may contain multiple error messages for one
 *   element
 *
 * There are five types of hardcoded validation error messages:
 *
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
  * array w/deeply nested property: {
    property: 'instance.newDisabilities[4].view:secondaryFollowUp.causedByDisability',
    message: 'is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
    schema: {...},
  }
  * non-empty "__errors" array: {
    __errors: ['error message']
  }
*/
/**
 * @typedef Form~formErrors
 * @type {object}
 * @property {Form~rawErrors}
 * @property {Form~errors}
 */
/**
 * Process rawErrors from jsonschema validator into a more friendly list
 * @param {Form~formErrors} errors
 * @param {object[]} pageList - list of all form pages from `form.pages`
 */
export const reduceErrors = (errors, pageList) =>
  errors.reduce((result, error) => {
    const findErrors = (name, err) => {
      if (typeof err === 'object') {
        // process the last type of error message which provides an `__errors`
        // message array. If there are multiple errors, we'll join them into
        // one message.
        if (err?.__errors?.length && !errorExists(result, name)) {
          const { chapterKey = '', pageKey = '' } = getPropertyInfo(
            pageList,
            name,
          );
          result.push({
            name,
            index: null,
            message: err.__errors.join('. '),
            chapterKey,
            pageKey,
          });
        }
        if (err.property) {
          // property includes a path to the error; we'll remove "instance",
          // then use `getPropertyInfo` to search the pageList to find the
          // matching chapterKey & pageKey
          const property = err.property.replace(/^instance\.?/, '') || '';
          // name is the property that had the validation error
          const propertyName =
            err.name === 'required'
              ? err.argument
              : property.replace(/(\[\d+\])/, ''); // don't include array index
          /*
           * There may be multiple errors for the same property, e.g.
           * `contestedIssues` in form 996. It can have a custom message
           * "Please select a contested issue" and a minItem error
           * "Does not meet minimum length of 1"; there's no need to confuse
           * anyone and show both
          */
          if (!errorExists(result, propertyName)) {
            const { chapterKey = '', pageKey = '' } = getPropertyInfo(
              // List of all form pages; includes chapterKey, pageKey and
              // uiSchema
              pageList,
              // in one error message, no argument is included, so we get it
              // from the property (path) destination
              err.argument || property.split('.').slice(-1)[0],
              // full path to the error
              property,
            );
            result.push({
              // property name
              name: propertyName,
              // property may be `array[0]`; we need to extract out the `0`
              index: property.match(/\[(\d+)\]/)?.[1] || null,
              // the "stack" string isn't included in the one error message
              // example, so we'll include the message. We'll process and
              // display this message to the user in some future work
              message: err.stack || err.message,
              // Accordion (chapter) key that needs to be highlighted
              chapterKey,
              // page within the chapter that contains the error; will be used
              // in future work to highlight the specific page for the user
              pageKey,
            });
          }
          return null;
        }
        // process nested error messages (follows uiSchema nesting)
        Object.keys(err).forEach(key => findErrors(key, err[key]));
      }
      return null;
    };
    // Initialize search for errors
    Object.keys(error).forEach(key => findErrors(key, error));
    return result;
  }, []);
