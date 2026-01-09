// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca Other Toxic Exposure Dates config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.otherToxicExposureDates;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 4;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 0;
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
        'view:toxicExposureDates': {
          type: 'object',
          properties: {
            toxicExposureStartDate: {
              type: 'string',
              pattern: {},
            },
            toxicExposureEndDate: {
              type: 'string',
              pattern: {},
            },
          },
        },
        'view:dateRange': {
          type: 'object',
          properties: {},
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'view:toxicExposureDates': {
        'ui:validations': {},
        toxicExposureStartDate: {
          'ui:description': {},
          'ui:title': {},
          'ui:errorMessages': {},
          'ui:validations': {},
          'ui:options': {},
        },
        toxicExposureEndDate: {
          'ui:description': {},
          'ui:title': {},
          'ui:errorMessages': {},
          'ui:validations': {},
          'ui:options': {},
        },
      },
      'view:dateRange': {
        'ui:description': {},
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
