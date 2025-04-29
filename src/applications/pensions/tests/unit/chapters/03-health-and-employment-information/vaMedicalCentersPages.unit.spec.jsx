import {
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import { vaMedicalCentersPages } from '../../../../config/chapters/03-health-and-employment-information/vaMedicalCentersPages';

describe('va medical centers summary page', () => {
  const { vaMedicalCentersSummary } = vaMedicalCentersPages;
  const pageTitle = 'va medical centers summary';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    vaMedicalCentersSummary.schema,
    vaMedicalCentersSummary.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    vaMedicalCentersSummary.schema,
    vaMedicalCentersSummary.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    vaMedicalCentersSummary.schema,
    vaMedicalCentersSummary.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    vaMedicalCentersSummary.schema,
    vaMedicalCentersSummary.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});

describe('pension add va medical centers page', () => {
  const vaMedicalCenterPage = {
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'VA medical center',
        nounSingular: 'va medical center',
      }),
      medicalCenter: textUI('VA medical center'),
    },
    schema: {
      type: 'object',
      properties: {
        medicalCenter: textSchema,
      },
      required: ['medicalCenter'],
    },
  };
  const pageTitle = 'va medical center ';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    vaMedicalCenterPage.schema,
    vaMedicalCenterPage.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    vaMedicalCenterPage.schema,
    vaMedicalCenterPage.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    vaMedicalCenterPage.schema,
    vaMedicalCenterPage.uiSchema,
    pageTitle,
    { medicalCenter: 'Generic Medical Center' },
  );

  testNumberOfFieldsByType(
    formConfig,
    vaMedicalCenterPage.schema,
    vaMedicalCenterPage.uiSchema,
    {
      'va-text-input': 1,
    },
    pageTitle,
  );
});
