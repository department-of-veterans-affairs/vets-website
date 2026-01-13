// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca SpouseAnnualIncome config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.SpouseAnnualIncome;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 3;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 3;
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
        'view:spouseGrossIncome': {
          type: 'object',
          properties: {
            spouseGrossIncome: {
              type: 'number',
            },
          },
        },
        'view:spouseNetIncome': {
          type: 'object',
          properties: {
            spouseNetIncome: {
              type: 'number',
            },
          },
        },
        'view:spouseOtherIncome': {
          type: 'object',
          properties: {
            spouseOtherIncome: {
              type: 'number',
            },
          },
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'view:spouseGrossIncome': {
        'ui:title': {},
        'ui:description': {},
        spouseGrossIncome: {
          'ui:title': {},
          'ui:options': {},
          'ui:validations': {},
          'ui:errorMessages': {},
        },
      },
      'view:spouseNetIncome': {
        'ui:title': {},
        'ui:description': {},
        spouseNetIncome: {
          'ui:title': {},
          'ui:options': {},
          'ui:validations': {},
          'ui:errorMessages': {},
        },
      },
      'view:spouseOtherIncome': {
        'ui:title': {},
        'ui:description': {},
        spouseOtherIncome: {
          'ui:title': {},
          'ui:options': {},
          'ui:validations': {},
          'ui:errorMessages': {},
        },
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
