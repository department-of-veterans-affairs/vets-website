// import {
//     arrayBuilderItemFirstPageTitleUI,
//     textUI,
//     textSchema,
//   } from '~/platform/forms-system/src/js/web-component-patterns';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  // testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  // testSubmitsWithoutErrors,
} from './pageTests.spec';
import formConfig from '../../config/form';
//   import { federalMedicalCentersPages } from '../../../../config/chapters/03-health-and-employment-information/federalMedicalCentersPages';
import {
  servicePeriodsPagesVeteran,
  servicePeriodInformationPage,
} from '../../config/pages/servicePeriodsPages';

describe('service periods summary page', () => {
  // const { federalMedicalCentersSummary } = federalMedicalCentersPages;
  const { servicePeriodsSummaryVeteran } = servicePeriodsPagesVeteran;
  const pageTitle = 'federal medical centers summary';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    servicePeriodsSummaryVeteran.schema,
    servicePeriodsSummaryVeteran.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    servicePeriodsSummaryVeteran.schema,
    servicePeriodsSummaryVeteran.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  // testSubmitsWithoutErrors(
  //   formConfig,
  //   servicePeriodsSummaryVeteran.schema,
  //   servicePeriodsSummaryVeteran.uiSchema,
  //   pageTitle,
  // );

  // testNumberOfFieldsByType(
  //   formConfig,
  //   servicePeriodsSummaryVeteran.schema,
  //   servicePeriodsSummaryVeteran.uiSchema,
  //   {
  //     'va-radio': 1,
  //   },
  //   pageTitle,
  // );
});

describe('pension add federal medical centers page', () => {
  const pageTitle = 'federal medical center ';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    servicePeriodInformationPage(true, false).schema,
    servicePeriodInformationPage(true, false).uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // const expectedNumberOfErrors = 1;
  // testNumberOfErrorsOnSubmitForWebComponents(
  //   formConfig,
  //   federalMedicalCenterPage.schema,
  //   federalMedicalCenterPage.uiSchema,
  //   expectedNumberOfErrors,
  //   pageTitle,
  // );

  // testSubmitsWithoutErrors(
  //   formConfig,
  //   federalMedicalCenterPage.schema,
  //   federalMedicalCenterPage.uiSchema,
  //   pageTitle,
  //   { medicalCenter: 'Generic Medical Center' },
  // );

  // testNumberOfFieldsByType(
  //   formConfig,
  //   federalMedicalCenterPage.schema,
  //   federalMedicalCenterPage.uiSchema,
  //   {
  //     'va-text-input': 1,
  //   },
  //   pageTitle,
  // );
});
