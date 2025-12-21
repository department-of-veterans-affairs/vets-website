// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca Military Service Information config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.serviceInformation;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 8;
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
        lastServiceBranch: {
          type: 'string',
        },
        lastEntryDate: {
          $ref: {},
        },
        lastDischargeDate: {
          $ref: {},
        },
        dischargeType: {
          type: 'string',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'ui:validations': {},
      lastServiceBranch: {
        'ui:title': {},
        'ui:options': {},
      },
      lastEntryDate: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:validations': {},
      },
      lastDischargeDate: {
        'ui:title': {},
        'ui:errorMessages': {},
      },
      dischargeType: {
        'ui:title': {},
        'ui:options': {},
      },
    },
    expectedRequired: [
      'lastServiceBranch',
      'lastEntryDate',
      'lastDischargeDate',
      'dischargeType',
    ],
    pageName: pageTitle,
  });
});
