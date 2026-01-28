// lifted directly from vets-json-schema test/support/schema-test-helper.js
import { expect } from 'chai';
import { it } from 'mocha';
import Ajv from 'ajv-draft-04';

const addFormats = require('ajv-formats');

const objectBuilder = (keys, value) => {
  let object = {};

  keys
    .split('.')
    .reverse()
    .forEach((key, i) => {
      if (i === 0) {
        object = {
          [key]: value,
        };
      } else {
        object = {
          [key]: object,
        };
      }
    });

  return object;
};

class SchemaTestHelper {
  constructor(schema, defaults = {}) {
    this.schema = schema;
    this.defaults = defaults;
    this.ajv = new Ajv({ strict: false });
    addFormats(this.ajv);
  }

  validateSchema(data) {
    return this.ajv.validate(this.schema, { ...this.defaults, ...data });
  }

  schemaExpect(valid, data) {
    expect(this.validateSchema(data)).to.equal(valid);
    if (!valid) {
      expect(this.ajv.errors[0].instancePath).to.contain(
        `/${Object.keys(data)[0]}`,
      );
    }
  }

  testValidAndInvalid(parentKey, fields) {
    ['valid', 'invalid'].forEach(fieldType => {
      const valid = fieldType === 'valid';
      fields[fieldType].forEach(values => {
        it(`should${
          valid ? '' : "n't"
        } allow ${parentKey} with ${JSON.stringify(values)}`, () => {
          this.schemaExpect(valid, objectBuilder(parentKey, values));
        });
      });
    });
  }
}

/**
 * Execute a test expectation for the provided data against the provided schema.
 * @param {object} schema - The json-schema definition to test the @data against
 * @param {object} data - The data to validate against the provided @schema.
 * @param {boolean} expectation - A boolean to assert the result of the validation against.
 */
SchemaTestHelper.expect = (schema, data, expectation) => {
  const ajv = new Ajv({ strict: false });
  addFormats(ajv);
  const [result, errors] = [ajv.validate(schema, data), ajv.errors];

  if (expectation === true && errors) {
    throw new Error(
      `Validation failed when expected to pass: ${JSON.stringify(errors)}`,
    );
  }

  if (expectation === false && result === true) {
    throw new Error(
      `Validation passed when expected to fail: ${JSON.stringify(data)}`,
    );
  }

  return expect(result).to.equal(expectation);
};

export default SchemaTestHelper;
