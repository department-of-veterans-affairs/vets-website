// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca Military Service History config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.additionalInformation;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 5;
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
        'view:serviceHistory': {
          type: 'object',
          properties: {
            purpleHeartRecipient: {
              type: 'boolean',
            },
            isFormerPow: {
              type: 'boolean',
            },
            postNov111998Combat: {
              type: 'boolean',
            },
            disabledInLineOfDuty: {
              type: 'boolean',
            },
            swAsiaCombat: {
              type: 'boolean',
            },
          },
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'view:serviceHistory': {
        purpleHeartRecipient: {
          'ui:title': {},
        },
        isFormerPow: {
          'ui:title': {},
        },
        postNov111998Combat: {
          'ui:title': {},
        },
        disabledInLineOfDuty: {
          'ui:title': {},
        },
        swAsiaCombat: {
          'ui:title': {},
        },
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
