// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca VeteranHomeAddress config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranHomeAddress;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 7;
  testNumberOfFormFields(
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
        veteranHomeAddress: {
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
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      veteranHomeAddress: {
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
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
