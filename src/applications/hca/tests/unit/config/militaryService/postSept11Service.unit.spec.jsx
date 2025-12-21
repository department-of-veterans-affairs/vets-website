// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca Post 9/11 Service config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.postSept11Service;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 2;
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
        gulfWarService: {
          type: 'boolean',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      gulfWarService: {
        'ui:title': {},
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
