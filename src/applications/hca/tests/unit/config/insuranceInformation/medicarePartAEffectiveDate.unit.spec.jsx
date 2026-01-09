// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca MedicarePartAEffectiveDate config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.medicarePartAEffectiveDate;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 4;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 2;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
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
        'ui:required': {},
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
