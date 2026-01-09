// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca VeteranAddress config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranAddress;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 9;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 5;
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
        veteranAddress: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
            },
            street2: {
              type: 'string',
            },
            street3: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            state: {
              type: 'string',
            },
            postalCode: {
              type: 'string',
            },
          },
        },
        'view:doesMailingMatchHomeAddress': {
          type: 'boolean',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      veteranAddress: {
        'ui:order': {},
        street: {
          'ui:title': {},
          'ui:errorMessages': {},
        },
        street2: {
          'ui:title': {},
        },
        street3: {
          'ui:title': {},
        },
        city: {
          'ui:title': {},
          'ui:errorMessages': {},
        },
        state: {
          'ui:title': {},
          'ui:errorMessages': {},
        },
        postalCode: {
          'ui:title': {},
          'ui:errorMessages': {},
          'ui:options': {},
        },
      },
      'view:doesMailingMatchHomeAddress': {
        'ui:title': {},
        'ui:required': {},
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
