// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca SpouseContactInformation config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.householdInformation.pages.SpouseContactInformation;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 8;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 4;
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
        spouseAddress: {
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
        spousePhone: {
          type: 'string',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      spouseAddress: {
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
      spousePhone: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:options': {},
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
