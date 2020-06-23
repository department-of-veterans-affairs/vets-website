const chalk = require('chalk');

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
 */
class TransformerRegistry {
  constructor() {
    this.registry = new Map();
    this.warnings = {
      input: new Set(),
      output: new Set(),
    };
  }

  register(inputSchema, outputSchema, transformer) {
    const input = serialize(inputSchema);
    const output = serialize(outputSchema);
    if (!this.registry.has(input)) {
      this.registry.set(input, new Map());
    }
    this.registry.get(input).set(output, transformer);
  }

  getTransformer(inputSchema, outputSchema) {
    const input = serialize(inputSchema);
    const output = serialize(outputSchema);

    if (!this.registry.has(input)) {
      // Log only once
      if (!this.warnings.input.has(input)) {
        // eslint-disable-next-line no-console
        console.warn(
          chalk.yellow('No transformers found for the input schema:'),
          input,
        );
        this.warnings.input.add(input);
      }
      return null;
    }

    const transformer = this.registry.get(input).get(output) || null;

    // Log only once
    if (!transformer && !this.warnings.output.has(output)) {
      // eslint-disable-next-line no-console
      console.warn(
        chalk.yellow('No transformers found for the output schema:'),
        output,
      );
      this.warnings.output.add(output);
    }

    return transformer;
  }
}

const fieldTransformers = new TransformerRegistry();
fieldTransformers.register(
  { $ref: 'GenericNestedString' },
  { type: 'string' },
  getDrupalValue,
);

module.exports = { fieldTransformers, normalize, serialize };
