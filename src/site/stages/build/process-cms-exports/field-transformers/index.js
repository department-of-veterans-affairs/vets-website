// TODO: Move this to field-transformers/getDrupalValue.js once we replace the
// content model transformers with these field transformers.
const { getDrupalValue } = require('../transformers/helpers');

/**
 * Reorders object properties for consistency. Returns all other types
 * unmodified.
 * @param {*} thing - The variable to normalize
 * @returns {*} Whatever type thing is
 */
const normalize = thing => {
  if (typeof thing !== 'object' || thing === null) {
    return thing;
  }

  // Alphabetize fields
  return Object.keys(thing)
    .sort()
    .reduce((res, currentKey) => {
      res[currentKey] = thing[currentKey];
      return res;
    }, {});
};

/**
 * Normalizes and stringifies a variable.
 *
 * For objects, normalization means alphabetizing the properties so two
 * otherwise-equal objects can be stringified and compared to each other even if
 * the properties are in a different order.
 * @param {*} thing - A variable to normalize and stringify
 * @returns {String}
 */
const serialize = thing => JSON.stringify(normalize(thing), null, 2);

/**
 * Maps a transformer to an input and output schema for an individual field.
 *
 * TODO: Make this less annoying for enums. This may mean removing enums
 * recursively in normalize(), but that seems maybe too specific? Not sure what
 * else we may need to do. Probably reasonable for a prototype, though.
 *
 * TODO: Make a system to register() new transformers
 * Example: register(inputSchema, outputSchema, transformerFunction)
 */
const fieldTransformers = new Map([
  [
    // Input schema: Data from Drupal looks like this
    serialize({ $ref: 'GenericNestedString' }),
    new Map([
      // Output schema: Data in the templates look like this
      [serialize({ type: 'string' }), getDrupalValue],
    ]),
  ],
]);

module.exports = { fieldTransformers, normalize, serialize };
