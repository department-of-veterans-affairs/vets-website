// @ts-check
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca Other Toxic Exposures config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.otherToxicExposure;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 10;
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
        'view:otherToxicExposures': {
          type: 'object',
          properties: {
            exposureToAirPollutants: {},
            exposureToAsbestos: {},
            exposureToChemicals: {},
            exposureToContaminatedWater: {},
            exposureToMustardGas: {},
            exposureToOccupationalHazards: {},
            exposureToRadiation: {},
            exposureToShad: {},
            exposureToWarfareAgents: {},
            exposureToOther: {},
          },
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      'view:otherToxicExposures': {
        exposureToAirPollutants: {
          'ui:title': {},
        },
        exposureToAsbestos: {
          'ui:title': {},
        },
        exposureToChemicals: {
          'ui:title': {},
        },
        exposureToContaminatedWater: {
          'ui:title': {},
        },
        exposureToMustardGas: {
          'ui:title': {},
        },
        exposureToOccupationalHazards: {
          'ui:title': {},
        },
        exposureToRadiation: {
          'ui:title': {},
        },
        exposureToShad: {
          'ui:title': {},
        },
        exposureToWarfareAgents: {
          'ui:title': {},
        },
        exposureToOther: {
          'ui:title': {},
        },
      },
    },
    expectedRequired: [],
    pageName: pageTitle,
  });
});
