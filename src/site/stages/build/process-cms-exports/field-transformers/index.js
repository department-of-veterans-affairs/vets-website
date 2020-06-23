const assert = require('assert');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const { getAllImportsFrom } = require('../helpers');

const transformerMappings = _.omit(
  getAllImportsFrom(path.resolve(__dirname)),
  'index',
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

  _register(inputSchema, outputSchema, transformer) {
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

  /**
   * Register the transformer function for all input and output schema
   * combinations specified in schemaMap.
   */
  registerTransformer(schemaMap, transformer) {
    // Sanity checks; the assertion messages could maybe use some polishing
    assert(
      Array.isArray(schemaMap),
      `schemaMap must be an array, but found ${typeof schemaMap}`,
    );
    assert(
      schemaMap.every(m => m.input && m.output),
      'Each entry in schemaMap must have an input and output property.',
    );
    assert(
      schemaMap.every(m => Array.isArray(m.output)),
      'The output property of every item in schemaMap must be an array',
    );

    for (const { input, output } of schemaMap) {
      for (const outputSchema of output) {
        this._register(input, outputSchema, transformer);
      }
    }
  }
}

const fieldTransformers = new TransformerRegistry();

// Register all transformers in field-transformers/
Object.entries(transformerMappings).forEach(([moduleName, moduleExports]) => {
  assert(
    typeof moduleExports.transformer === 'function',
    `${moduleName}.js does not export a transformer function`,
  );
  assert(
    moduleExports.schemaMap,
    `${moduleName}.js does not export a schemaMap property`,
  );

  fieldTransformers.registerTransformer(
    moduleExports.schemaMap,
    moduleExports.transformer,
  );
});

module.exports = { fieldTransformers, normalize, serialize };
