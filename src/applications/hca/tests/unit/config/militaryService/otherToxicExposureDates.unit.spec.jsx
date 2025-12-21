// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca Other Toxic Exposure Dates config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.otherToxicExposureDates;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 4;
  testNumberOfFormFields(
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
