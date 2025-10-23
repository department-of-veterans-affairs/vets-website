import {
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import { federalMedicalCentersPages } from '../../../../config/chapters/03-health-and-employment-information/federalMedicalCentersPages';

describe('federal medical centers summary page', () => {
  const { federalMedicalCentersSummary } = federalMedicalCentersPages;
  const pageTitle = 'federal medical centers summary';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    federalMedicalCentersSummary.schema,
    federalMedicalCentersSummary.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    federalMedicalCentersSummary.schema,
    federalMedicalCentersSummary.uiSchema,
    [
      `va-radio[label="Have you received treatment from any non-VA federal medical facilities within the past year?"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    federalMedicalCentersSummary.schema,
    federalMedicalCentersSummary.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    federalMedicalCentersSummary.schema,
    federalMedicalCentersSummary.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});

describe('pension add federal medical centers page', () => {
  const federalMedicalCenterPage = {
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'Federal medical center',
        nounSingular: 'federal medical center',
      }),
      medicalCenter: textUI('Federal medical center'),
    },
    schema: {
      type: 'object',
      properties: {
        medicalCenter: textSchema,
      },
      required: ['medicalCenter'],
    },
  };
  const pageTitle = 'federal medical center ';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    federalMedicalCenterPage.schema,
    federalMedicalCenterPage.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    federalMedicalCenterPage.schema,
    federalMedicalCenterPage.uiSchema,
    [`va-text-input[label="Federal medical center"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    federalMedicalCenterPage.schema,
    federalMedicalCenterPage.uiSchema,
    pageTitle,
    { medicalCenter: 'Generic Medical Center' },
  );

  testNumberOfFieldsByType(
    formConfig,
    federalMedicalCenterPage.schema,
    federalMedicalCenterPage.uiSchema,
    {
      'va-text-input': 1,
    },
    pageTitle,
  );
});
