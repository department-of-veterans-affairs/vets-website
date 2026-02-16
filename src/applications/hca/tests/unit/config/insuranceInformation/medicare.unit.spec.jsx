// @ts-check
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';
import formConfig from '../../../../config/form';

describe('hca Medicare config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.insuranceInformation.pages.medicare;

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
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
        isEnrolledMedicarePartA: {
          type: 'boolean',
        },
      },
    },
    expectedUiSchema: {
      'ui:title': {},
      isEnrolledMedicarePartA: {
        'ui:title': {},
        'ui:webComponentField': {},
      },
    },
    expectedRequired: ['isEnrolledMedicarePartA'],
    pageName: pageTitle,
  });
});
