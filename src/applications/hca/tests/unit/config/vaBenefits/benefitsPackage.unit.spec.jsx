// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca VaBenefitsPackage config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.vaBenefits.pages.vaBenefitsPackage;

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
        'view:vaBenefitsPackage': {
          type: 'string',
          enum: {},
        },
        'view:registrationOnlyNote': {
          type: 'object',
          properties: {},
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'ui:description': {},
      'view:vaBenefitsPackage': {
        'ui:title': {},
        'ui:options': {},
      },
      'view:registrationOnlyNote': {
        'ui:description': {},
      },
    },
    expectedRequired: ['view:vaBenefitsPackage'],
    pageName: pageTitle,
  });
});
