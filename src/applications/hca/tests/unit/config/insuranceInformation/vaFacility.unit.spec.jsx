// @ts-check
import {
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca VaFacility config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.vaFacility;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 0;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfWebComponentFields = 3;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );

  // Schema regression tests to ensure backward compatibility during migration
  runSchemaRegressionTests({
    actualSchema: schema,
    actualUiSchema: uiSchema,
    expectedSchema: {
      type: 'object',
      properties: {
        'view:preferredFacility': {
          type: 'object',
          properties: {
            'view:facilityState': {
              type: 'string',
            },
            vaMedicalFacility: {
              type: 'string',
            },
          },
        },
        'view:locator': {
          type: 'object',
          properties: {},
        },
        wantsInitialVaContact: {
          type: 'boolean',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'view:preferredFacility': {
        'ui:field': {}, // Custom field - keep as-is
      },
      'view:locator': {
        'ui:description': {},
      },
      wantsInitialVaContact: {
        'ui:title': {},
        'ui:webComponentField': {},
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
