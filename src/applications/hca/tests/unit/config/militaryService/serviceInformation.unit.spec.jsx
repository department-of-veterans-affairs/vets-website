// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca Military Service Information config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.serviceInformation;

  // run test for correct number of fields on the page (mixed: 2 web components + 6 date fields)
  const expectedNumberOfWebComponentFields = 2;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );

  const expectedNumberOfOldFields = 6;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfOldFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit (mixed)
  const expectedNumberOfWebComponentErrors = 2;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentErrors,
    pageTitle,
  );

  const expectedNumberOfOldErrors = 2;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfOldErrors,
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
