import numberToWords from './numberToWords';

// Process JSON-schema error messages for viewing

/**
 * Convert array zero-based number `test[0]` into a word `first test`
 * @param {string} _ - Entire regex matching group (unused)
 * @param {string} word - Word portion of the regexp that matches the array name,
 *   e.g. in "array[0]", "array" would be the word
 * @param {string} number - Number portion of the regexp that matches the number
 * @returns {string} "{converted word number} {word}"
 */
export const replaceNumberWithWord = (_, word, number) => {
  const num = parseInt(number, 10);
  return `${
    isNaN(num) || !isFinite(num) ? number : numberToWords(num + 1)
  } ${word}`;
};

/**
 * @typedef FormConfig~reviewErrorMessage
 * @type {string|function}
 * @param {number} index - provided to the function if the schema property is an
 *  array. This index indicates the index of the entry with an error
 * @returns {string} predefined error message
 */
/**
 * @typedef FormConfig~reviewErrorOverride
 * @type {function}
 * @param {string} error - error containing either the name of the property with
 *  the error, or the error stack (if it exists), or the error argument
 * @returns {object} - object containing the `chapterKey` and `pageKey`
 *  associated with the error; needed for summary pages on the review & submit
 *  page
 */
/**
 * @typedef FormConfig~reviewErrors - Cross-reference of required schema names
 *  with the error message displayed inside of the alert error link
 * @type {Object}
 * @property {Object.<string>} - required schema name (key)
 * @property {FormConfig~reviewErrorMessage} - Error message string or function
 *  that returns a string
 * @property {FormConfig~reviewErrorOverride} - Function to return the chapter
 *  and page key for a particular error
 */
/**
 * Get error message contained in FormConfig~reviewErrors
 * @param {string|function} message - property name with an error
 * @param {string} index - index of error (as a string, so it is concerted)
 * @returns {string} Predefined error message
 */
export const getErrorMessage = (message, index = '') =>
  typeof message === 'function' ? message(Number(index)) : message || '';

// Regexp & replace string/function to reformat hard-coded error messages
const messageFormatting = [
  // Error messages include "requires property" or "instance."
  { regex: /(requires property|instance\.?)\s*/g, replace: '' },
  // Don't show the "view:" or "ui:" prefix
  { regex: /(view:|ui:|")/g, replace: '' },
  // Convert numbers into words
  { regex: /(\w+)\[(\d+)\]/, replace: replaceNumberWithWord },
  // Separate numbers (e.g. "address1" -> "address 1")
  { regex: /([a-z])(\d)/g, replace: '$1 $2 ' },
  // "zip" code replaced with "postal" code in content, but not property names
  { regex: /zip\s(code)?/i, replace: 'postal code' },
  // Make abbreviations upper case
  { regex: /\b(va|pow)\b/g, replace: str => ` ${str.toUpperCase()} ` },
  // "enum values:" may be followed by a very long list (e.g. all countries)
  { regex: /(enum\svalues:.+)$/g, replace: 'the available values' },
];

/**
 * Make hard-coded jsonschema validation error messages _more_ readable, e.g.
 * - Changes`instance.news does not meet minimum length of 1` to
 *   `News does not meet minimum length of 1`
 * - Changes `instance.address requires property "city"` to `Address city`
 * - Array type properties need to get special treatment,
 *   `"instance.newDisabilities[0] requires property "cause"` is modified into
 *   `First new disabilities cause`.
 * These formatting methods use the schema property name, which isn't ideal.
 * That's why this is used as a fallback for the predefined `reviewErrors`
 * object in the form config - see FormConfig~reviewErrors
 * @param {string} message - hard coded error message
 * @returns {string} - transformed "human-readable" error message
 */
export const formatErrors = message =>
  messageFormatting
    .reduce(
      (newMessage, transformer) =>
        newMessage.replace(transformer.regex, transformer.replace),
      message,
    )
    .trim()
    // make first letter upper case
    .replace(/^./, str => str.toUpperCase());

// Keys to ignore within the pageList objects & pageList uiSchema
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
  'onContinue',
  'showPagePerItem',
  'itemFilter',
  'arrayPath',
  'updateFormData',
  'appStateSelector',
];

/**
 * @typedef Form~pageList
 * @type {object[]}
 * @property {string} title - page title
 * @property {string} path - url path
 * @property {object} uiSchema - page uiSchema
 * @property {object} schema - page schema
 * @property {string} chapterTitle - title shown in review accordion
 * @property {string} chapterKey - chapter key from config/form
 * @property {string} pageKey - page key within chapter key from config/form
 */
/**
 * Find the chapter and page name that contains the property (name) which is
 * then used to find the associated accordion on the review & submit page; the
 * associated chapter (accordion) will then be highlighted to indicate a problem
 * Eventually, the page name will be used to target the specific page, then form
 * element to take the user directly to the problem
 * @param {Form~pageList} pageList - list of all form pages from `route.pageList`
 * @param {string} name - target end path where the error occurred
 * @param {string} instance - path inside the page object within the uiSchema,
 *   but we can't specify that since this is a recursive search function
 * @return {object} - single page from the matching pageList object, or an empty
 *   page object if the name is not found on any page
 */
export const getPropertyInfo = (pageList = [], name, instance = '') => {
  const findPageIndex = (
    obj,
    insideInstance = instance === '' || instance === name,
  ) => {
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).findIndex(key => {
        if (key.startsWith('ui:') || ignoreKeys.includes(key)) {
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
 * min/max length or item errors may show up as duplicates
 * Comparing index with null to prevent overall "null" index from repeating
 * item array specific index
 * @param {Form~errors} list - list of error messages
 * @param {string} name - error name
 * @param {number|null} index - error index
 * @returns {boolean} true if the name/index already exist in the list
 */
const errorExists = (list, name, index) =>
  list.some(obj => obj.name === name && obj.index === index);

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
  * array with argument array: {
    argument: ['Abc', 'Bcd', 'Cde', 'Def', 'Efg', 'Fgh', 'Ghi', 'Hij'],
    message: 'is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
    name: 'enum',
    property: 'instance.newDisabilities[6].view:secondaryFollowUp.causedByDisability',
    schema: {},
    stack: 'instance.newDisabilities[6].view:secondaryFollowUp.causedByDisability is not one of enum values: Abc,Bcd,Cde,Def,Efg,Fgh,Ghi,Hij',
  }
  * non-empty "__errors" array: {
    __errors: ['error message']
  }
*/
/**
 * Process rawErrors from jsonschema validator into a more friendly list
 * @param {Form~rawErrors} errors - raw form errors from jsonschema validator
 * @param {Form~pageList} pageList - list of all form pages from `route.pageList`
 * @return {Form~errors} - Finely curated list of form errors
 */
export const reduceErrors = (errors, pageList, reviewErrors = {}) =>
  errors.reduce((processedErrors, error) => {
    let errorIndex = null; // save key (index) of array items with __error
    const findErrors = (name, err) => {
      if (err && typeof err === 'object') {
        // process the last type of error message which provides an `__errors`
        // message array. If there are multiple errors, we'll join them into
        // one message.
        if (
          err.__errors?.length &&
          !errorExists(processedErrors, name, errorIndex)
        ) {
          const { chapterKey = '', pageKey = '' } =
            reviewErrors._override?.(name || err.stack || err.argument, err) ||
            getPropertyInfo(pageList, name);
          // `message` is null if we don't want a link to show up.
          // For example, this happens for the 526 when a new disability is
          // missing (has error), and the nested required condition (also has
          // an error) is also missing.
          const message = getErrorMessage(reviewErrors[name], errorIndex);
          if (message !== null) {
            processedErrors.push({
              name,
              index: errorIndex || null,
              message:
                message || err.__errors.map(e => formatErrors(e)).join('. '),
              chapterKey,
              pageKey,
            });
          }
        } else if (err.property) {
          // property includes a path to the error; we'll remove "instance",
          // then use `getPropertyInfo` to search the pageList to find the
          // matching chapterKey & pageKey
          const property = err.property.replace(/^instance\.?/, '') || '';
          // in one error message type, no argument is included, and in another
          // it is an array... so we get it from the property (path) destination
          // examples:
          //
          // http://sentry.vfs.va.gov/vets-gov/website-production/issues/12188/events/cf24a5bc9ef9452e9611f3e14846f6f0/
          const argument =
            Array.isArray(err.argument) || !err.argument || !isNaN(err.argument)
              ? property.split('.').slice(-1)[0]
              : err.argument;
          // name is the property that had the validation error
          const propertyName =
            err.name === 'required'
              ? argument
              : property.replace(/(\[\d+\])/, ''); // don't include array index
          // property may be `array[0]`; we need to extract out the `0`
          const index = property.match(/\[(\d+)\]/)?.[1] || null;
          /*
           * There may be multiple errors for the same property, e.g.
           * `contestedIssues` in form 996. It can have a custom message
           * "Please select a contested issue" and a minItem error
           * "Does not meet minimum length of 1"; there's no need to confuse
           * anyone and show both
          */
          if (!errorExists(processedErrors, propertyName, index)) {
            const { chapterKey = '', pageKey = '' } =
              reviewErrors._override?.(property || err?.stack || argument) ||
              getPropertyInfo(
                // List of all form pages; includes chapterKey, pageKey and
                // uiSchema
                pageList,
                argument,
                // full path to the error
                property,
              );
            processedErrors.push({
              // property name
              name: propertyName,
              index,
              // the "stack" string isn't included in the one error message
              // example, so we'll include the message. We'll process and
              // display this message to the user in some future work
              message:
                getErrorMessage(reviewErrors[propertyName], index) ||
                formatErrors(err.stack || err.message),
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
        Object.keys(err).forEach(key => {
          if (!isNaN(key) && typeof err[key] !== 'string') {
            // save array/object index if key is a number; but ignore it if the
            // value is a string, e.g. an __error message string
            errorIndex = key;
          }
          findErrors(key, err[key]);
        });
      }
      return null;
    };
    // Initialize search for errors
    Object.keys(error).forEach(key => findErrors(key, error));
    return processedErrors;
  }, []);
