// @ts-check
import { expect } from 'chai';

/**
 * Recursively checks that all properties in the expected object exist in the actual object
 * This ensures backward compatibility - new properties can be added, but existing ones must remain
 * @param {object} actual - The actual object to check
 * @param {object} expected - The expected properties that must exist
 * @param {string} path - Current path for error messages
 */
const assertPropertiesExist = (actual, expected, path = '') => {
  if (expected === null || expected === undefined) {
    return;
  }

  if (typeof expected === 'object' && !Array.isArray(expected)) {
    // Check if actual is null/undefined when expected has properties to check
    if (actual === null || actual === undefined) {
      const location = path || 'root';
      throw new Error(
        `Expected object at ${location} but got ${
          actual === null ? 'null' : 'undefined'
        }`,
      );
    }

    Object.keys(expected).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      expect(actual, `Missing property at ${currentPath}`).to.have.property(
        key,
      );
      assertPropertiesExist(actual[key], expected[key], currentPath);
    });
  }
};

/**
 * Tests that all schema properties from the old/expected schema exist in the actual schema
 * This is a regression test to ensure migration doesn't remove expected properties
 * @param {object} actualSchema - The actual schema to test
 * @param {object} expectedSchema - The expected schema properties that must exist
 * @param {string} testName - Name for the test
 */
export const testSchemaProperties = (
  actualSchema,
  expectedSchema,
  testName = 'schema',
) => {
  it(`should have all expected ${testName} properties`, () => {
    assertPropertiesExist(actualSchema, expectedSchema, testName);
  });
};

/**
 * Tests that all uiSchema properties from the old/expected uiSchema exist in the actual uiSchema
 * Excludes ui:widget, widgetClassNames, and classNames from comparison as these are styling/widget properties that may change during migration
 * @param {object} actualUiSchema - The actual uiSchema to test
 * @param {object} expectedUiSchema - The expected uiSchema properties that must exist
 * @param {string} testName - Name for the test
 */
export const testUiSchemaProperties = (
  actualUiSchema,
  expectedUiSchema,
  testName = 'uiSchema',
) => {
  it(`should have all expected ${testName} properties (excluding ui:widget, widgetClassNames, classNames)`, () => {
    // Create a deep clone of expected without widget/styling properties
    const filterWidgetProperties = obj => {
      if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(filterWidgetProperties);
      }

      const filtered = {};
      Object.keys(obj).forEach(key => {
        // Exclude widget-related and styling properties that can change during migration
        if (
          key !== 'ui:widget' &&
          key !== 'widgetClassNames' &&
          key !== 'classNames'
        ) {
          filtered[key] = filterWidgetProperties(obj[key]);
        }
      });
      return filtered;
    };

    const filteredExpected = filterWidgetProperties(expectedUiSchema);
    assertPropertiesExist(actualUiSchema, filteredExpected, testName);
  });
};

/**
 * Tests that all required fields from the expected schema exist in the actual schema
 * @param {object} actualSchema - The actual schema with required array
 * @param {Array<string>} expectedRequired - Array of required field names that must exist
 * @param {string} testName - Name for the test
 */
export const testRequiredFields = (
  actualSchema,
  expectedRequired = [],
  testName = 'schema',
) => {
  if (!expectedRequired || expectedRequired.length === 0) {
    it(`should have no required fields for ${testName}`, () => {
      const actualRequired = actualSchema.required || [];
      expect(actualRequired).to.have.lengthOf(0);
    });
    return;
  }

  it(`should have all expected required fields for ${testName}`, () => {
    const actualRequired = actualSchema.required || [];
    expectedRequired.forEach(field => {
      expect(
        actualRequired,
        `Required field "${field}" is missing from ${testName}.required`,
      ).to.include(field);
    });
  });
};

/**
 * Comprehensive regression test suite for a form page
 * Tests schema properties, uiSchema properties (excluding ui:widget, widgetClassNames, classNames), and required fields
 * @param {object} params
 * @param {object} params.actualSchema - The actual schema to test
 * @param {object} params.actualUiSchema - The actual uiSchema to test
 * @param {object} params.expectedSchema - The expected schema properties
 * @param {object} params.expectedUiSchema - The expected uiSchema properties
 * @param {Array<string>} params.expectedRequired - Expected required fields
 * @param {string} params.pageName - Name of the page being tested
 */
export const runSchemaRegressionTests = ({
  actualSchema,
  actualUiSchema,
  expectedSchema,
  expectedUiSchema,
  expectedRequired = [],
  pageName,
}) => {
  describe(`Schema Regression Tests - ${pageName}`, () => {
    testSchemaProperties(actualSchema, expectedSchema, 'schema');
    testUiSchemaProperties(actualUiSchema, expectedUiSchema, 'uiSchema');
    testRequiredFields(actualSchema, expectedRequired, 'schema');
  });
};
