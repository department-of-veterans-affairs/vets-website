/* eslint-disable no-console */
const assert = require('assert');
const chalk = require('chalk');

// Individual field-level transformers
const address = require('./address');
const getDrupalValue = require('./get-drupal-value');
const epochTime = require('./epoch-time');
const getWysiwygString = require('./get-wysiwyg-string');
const table = require('./table');

class FieldTransformer {
  constructor(transformers) {
    this.transformers = [];
    transformers.forEach(tr => this.registerTransformer(tr));
  }

  /**
   * Determine whether the associated transform callback should be called.
   * @callback Transformer-predicate
   * @param {object} fieldSchema - The schema for the field
   * @param {object} fieldData - The data for the field
   * @return {bool} - True of the transform function should be called
   */

  /**
   * Transform the field data and return the result.
   * @callback Transformer-transform
   * @param {object} fieldData - The data for the field
   * @return {any} - The result of the transformation
   */

  /**
   * Register a transformer function to run on a field when the predicate is
   * true.
   * @param {Transformer-predicate} tr.predicate - Function to determine whether the
   *                               transformer should be run
   * @param {Transformer-transform} tr.transform - Function to perform the data manipulation
   */
  registerTransformer({ predicate, transform }) {
    assert(typeof predicate === 'function');
    assert(typeof transform === 'function');
    this.transformers.push({ predicate, transform });
  }

  /**
   * Find and use the transformer on the field data. Return the result.
   * @param {object[]} fieldData - The data for the field
   * @param {object} fieldSchema - The schema for the field
   * @returns {any} - The result of the transformation
   * @throws {Error} - If no transformer is found for the field
   */
  transform(fieldData, fieldSchema) {
    const transformer = this.transformers.find(tr =>
      tr.predicate(fieldSchema, fieldData),
    );
    if (!transformer) {
      console.error(chalk.red('Could not find transformer.'));
      console.error(
        chalk.yellow('Field data:'),
        JSON.stringify(fieldData, null, 2),
      );
      console.error(
        chalk.yellow('Field schema:'),
        JSON.stringify(fieldSchema, null, 2),
      );
      throw new Error('Could not find transformer.');
    }

    return transformer.transform(fieldData, fieldSchema);
  }
}

const fieldTransformer = new FieldTransformer([
  address,
  getDrupalValue,
  epochTime,
  getWysiwygString,
  table,
]);

module.exports = fieldTransformer;
