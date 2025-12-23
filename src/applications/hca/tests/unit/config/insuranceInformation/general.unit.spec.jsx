// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca GeneralInsurance config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.general;

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
        isCoveredByHealthInsurance: {
          type: 'boolean',
        },
        providers: {
          type: 'array',
        },
      },
    },
    expectedUiSchema: {
      isCoveredByHealthInsurance: {
        'ui:title': {},
        'ui:reviewField': {},
      },
      providers: {
        'ui:options': {},
        'ui:errorMessages': {},
        items: {
          'ui:options': {},
          'ui:validations': {},
          'ui:order': {},
          insuranceName: {
            'ui:title': {},
            'ui:errorMessages': {},
          },
          insurancePolicyHolderName: {
            'ui:title': {},
            'ui:errorMessages': {},
          },
          insurancePolicyNumber: {
            'ui:title': {},
            'ui:description': {},
            'ui:reviewField': {},
            'ui:errorMessages': {},
          },
          insuranceGroupCode: {
            'ui:title': {},
            'ui:description': {},
            'ui:reviewField': {},
            'ui:errorMessages': {},
          },
        },
      },
    },
    expectedRequired: ['isCoveredByHealthInsurance'],
    pageName: pageTitle,
  });
});
