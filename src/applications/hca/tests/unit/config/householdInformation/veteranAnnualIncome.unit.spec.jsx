// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca VeteranAnnualIncome config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.VeteranAnnualIncome;

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
        'view:veteranGrossIncome': {
          type: 'object',
          properties: {
            veteranGrossIncome: {
              type: 'number',
            },
          },
        },
        'view:veteranNetIncome': {
          type: 'object',
          properties: {
            veteranNetIncome: {
              type: 'number',
            },
          },
        },
        'view:veteranOtherIncome': {
          type: 'object',
          properties: {
            veteranOtherIncome: {
              type: 'number',
            },
          },
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'view:veteranGrossIncome': {
        'ui:title': {},
        'ui:description': {},
        veteranGrossIncome: {
          'ui:title': {},
          'ui:options': {},
          'ui:validations': {},
          'ui:errorMessages': {},
        },
      },
      'view:veteranNetIncome': {
        'ui:title': {},
        'ui:description': {},
        veteranNetIncome: {
          'ui:title': {},
          'ui:options': {},
          'ui:validations': {},
          'ui:errorMessages': {},
        },
      },
      'view:veteranOtherIncome': {
        'ui:title': {},
        'ui:description': {},
        veteranOtherIncome: {
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
