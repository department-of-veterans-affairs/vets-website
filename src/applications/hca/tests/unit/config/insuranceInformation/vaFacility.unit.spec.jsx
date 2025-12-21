// @ts-check
import formConfig from '../../../../config/form';
import { testNumberOfFormFields } from '../../../helpers.spec';
import { runSchemaRegressionTests } from '../../../helpers/schemaRegressionHelpers';

describe('hca VaFacility config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.vaFacility;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 4;
  testNumberOfFormFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
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
        'ui:field': {},
      },
      'view:locator': {
        'ui:description': {},
      },
      wantsInitialVaContact: {
        'ui:title': {},
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
