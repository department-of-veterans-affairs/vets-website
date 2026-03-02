// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca VeteranDemographicInformation config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.demographicInformation;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 7;
  testNumberOfFields(
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
        'view:demographicCategories': {
          type: 'object',
          properties: {
            isAmericanIndianOrAlaskanNative: {
              type: 'boolean',
            },
            isAsian: {
              type: 'boolean',
            },
            isBlackOrAfricanAmerican: {
              type: 'boolean',
            },
            isSpanishHispanicLatino: {
              type: 'boolean',
            },
            isNativeHawaiianOrOtherPacificIslander: {
              type: 'boolean',
            },
            isWhite: {
              type: 'boolean',
            },
            hasDemographicNoAnswer: {
              type: 'boolean',
            },
          },
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'view:demographicCategories': {
        'ui:title': {},
        'ui:field': {},
        isAmericanIndianOrAlaskanNative: {
          'ui:title': {},
        },
        isSpanishHispanicLatino: {
          'ui:title': {},
        },
        isAsian: {
          'ui:title': {},
        },
        isBlackOrAfricanAmerican: {
          'ui:title': {},
        },
        isNativeHawaiianOrOtherPacificIslander: {
          'ui:title': {},
        },
        isWhite: {
          'ui:title': {},
        },
        hasDemographicNoAnswer: {
          'ui:title': {},
        },
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
