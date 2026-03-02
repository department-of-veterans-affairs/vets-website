// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca Gulf War Service Dates config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.gulfWarServiceDates;

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
        'view:gulfWarServiceDates': {
          type: 'object',
          properties: {
            gulfWarStartDate: {
              type: 'string',
              pattern: {},
            },
            gulfWarEndDate: {
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
      'view:gulfWarServiceDates': {
        'ui:validations': {},
        gulfWarStartDate: {
          'ui:description': {},
          'ui:title': {},
          'ui:errorMessages': {},
          'ui:validations': {},
          'ui:options': {},
        },
        gulfWarEndDate: {
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
