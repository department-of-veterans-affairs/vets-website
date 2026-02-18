// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca VeteranPlaceOfBirth config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.birthInformation;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 2;
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
        'view:placeOfBirth': {
          type: 'object',
          properties: {
            cityOfBirth: {
              type: 'string',
            },
            stateOfBirth: {
              type: 'string',
            },
          },
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'ui:description': {},
      'view:placeOfBirth': {
        cityOfBirth: {
          'ui:title': {},
        },
        stateOfBirth: {
          'ui:title': {},
        },
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
