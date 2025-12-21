// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca VeteranDateOfBirth config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.dobInformation;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 3;
  testNumberOfFormFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 1;
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
        veteranDateOfBirth: {
          type: 'string',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      veteranDateOfBirth: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:validations': {},
      },
    },
    expectedRequired: ['veteranDateOfBirth'],
    pageName: pageTitle,
  });
});
