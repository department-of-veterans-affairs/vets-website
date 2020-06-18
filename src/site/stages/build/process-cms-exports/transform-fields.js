const path = require('path');
const { getAllImportsFrom } = require('./helpers');
const { getDrupalValue } = require('./transformers/helpers');

const transformers = getAllImportsFrom(
  path.resolve(__dirname, 'field-transformers'),
);

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

/**
 * @param {Object} entity - The raw entity
 * @param {Object} [outputSchema] - The schema defining what the output should
 *                                  look like. If undefined, this will use the
 *                                  transformed schema for the content model
 *                                  type.
 */
function transformFields(entity, outputSchema) {
  // Get the input schema for the entity
  //   Log the missing schema
  //     Not sure about this one; it should be logged already in validateInput
  // Find the ouput schema
  //   Log the missing schema
  //   Return the unmodified entity if this is missing
  //
  // Iterate over each field:
  // If the input schema is an entity reference, find the entity reference data and recurse
  // Find the input schema transformers
  //   Log the missing set of transformers
  //   Return the unmodified field if missing
  // Find the specific field transformer
  //   Log the missing transformer if applicable
  //   Return the unmodified field if missing
  // Return the transformed field
}

module.exports = { serialize, transformFields };
