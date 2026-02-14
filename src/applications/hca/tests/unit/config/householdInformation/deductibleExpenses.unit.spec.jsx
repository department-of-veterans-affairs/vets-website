// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca DeductibleExpenses config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.DeductibleExpenses;

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
        'view:deductibleMedicalExpenses': {
          type: 'object',
          properties: {
            deductibleMedicalExpenses: {
              type: 'number',
            },
          },
        },
        'view:deductibleEducationExpenses': {
          type: 'object',
          properties: {
            deductibleEducationExpenses: {
              type: 'number',
            },
          },
        },
        'view:deductibleFuneralExpenses': {
          type: 'object',
          properties: {
            deductibleFuneralExpenses: {
              type: 'number',
            },
          },
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'view:deductibleMedicalExpenses': {
        'ui:title': {},
        'ui:description': {},
        deductibleMedicalExpenses: {
          'ui:title': {},
          'ui:options': {},
          'ui:validations': {},
          'ui:errorMessages': {},
        },
      },
      'view:deductibleEducationExpenses': {
        'ui:title': {},
        'ui:description': {},
        deductibleEducationExpenses: {
          'ui:title': {},
          'ui:options': {},
          'ui:validations': {},
          'ui:errorMessages': {},
        },
      },
      'view:deductibleFuneralExpenses': {
        'ui:title': {},
        'ui:description': {},
        deductibleFuneralExpenses: {
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
