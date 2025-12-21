// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca VeteranContactInformation config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.contactInformation;

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
        email: {
          type: 'string',
        },
        homePhone: {
          type: 'string',
        },
        mobilePhone: {
          type: 'string',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      email: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:options': {},
      },
      homePhone: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:options': {},
      },
      mobilePhone: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:options': {},
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
