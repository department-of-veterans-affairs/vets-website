// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca SpouseBasicInformation config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.SpouseBasicInformation;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 11;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 5;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  // Schema regression tests to ensure backward compatibility during migration
  runSchemaRegressionTests({
    actualSchema: schema,
    actualUiSchema: uiSchema,
    expectedSchema: {
      type: 'object',
      properties: {
        spouseFullName: {
          type: 'object',
          properties: {
            first: {
              type: 'string',
            },
            middle: {
              type: 'string',
            },
            last: {
              type: 'string',
            },
            suffix: {
              type: 'string',
            },
          },
        },
        spouseSocialSecurityNumber: {
          type: 'string',
        },
        spouseDateOfBirth: {
          $ref: {},
        },
        dateOfMarriage: {
          $ref: {},
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      spouseFullName: {
        first: {
          'ui:title': {},
        },
        middle: {
          'ui:title': {},
        },
        last: {
          'ui:title': {},
        },
        suffix: {
          'ui:title': {},
          'ui:options': {},
        },
      },
      spouseSocialSecurityNumber: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:options': {},
      },
      spouseDateOfBirth: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:validations': {},
      },
      dateOfMarriage: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:validations': {},
      },
    },
    expectedRequired: [
      'spouseSocialSecurityNumber',
      'spouseDateOfBirth',
      'dateOfMarriage',
    ],
    pageName: pageTitle,
  });
});
