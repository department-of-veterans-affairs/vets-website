// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca MedicarePartAEffectiveDate config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.medicarePartAEffectiveDate;

  // run test for correct number of web component fields (medicareClaimNumber textUI)
  const expectedNumberOfWebComponentFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );

  // run test for correct number of old fields (date field)
  const expectedNumberOfOldFields = 3;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfOldFields,
    pageTitle,
  );

  // run test for correct number of web component errors
  const expectedNumberOfWebComponentErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentErrors,
    pageTitle,
  );

  // run test for correct number of old errors (date field errors)
  const expectedNumberOfOldErrors = 1;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfOldErrors,
    pageTitle,
  );

  // Schema regression tests to ensure backward compatibility during migration
  // NOTE: medicarePartAEffectiveDate currently uses FULL_SCHEMA which has $ref
  // When migrating to web component date patterns, update this to expect:
  // { type: 'string', pattern: {}, minLength: {}, maxLength: {} }
  runSchemaRegressionTests({
    actualSchema: schema,
    actualUiSchema: uiSchema,
    expectedSchema: {
      type: 'object',
      properties: {
        medicarePartAEffectiveDate: {
          $ref: {}, // From FULL_SCHEMA - will change during web component migration
        },
        medicareClaimNumber: {
          type: 'string',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      medicarePartAEffectiveDate: {
        'ui:description': {},
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:validations': {},
        'ui:options': {},
        'ui:reviewField': {},
        'ui:required': {},
      },
      medicareClaimNumber: {
        'ui:description': {},
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:reviewField': {},
      },
    },
    expectedRequired: ['medicareClaimNumber'],
    pageName: pageTitle,
  });
});
