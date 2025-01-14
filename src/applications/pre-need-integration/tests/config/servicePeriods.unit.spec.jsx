// import {
//     arrayBuilderItemFirstPageTitleUI,
//     textUI,
//     textSchema,
//   } from '~/platform/forms-system/src/js/web-component-patterns';
import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  // testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  // testSubmitsWithoutErrors,
  testRender,
} from './pageTests.spec';
import formConfig from '../../config/form';
//   import { federalMedicalCentersPages } from '../../../../config/chapters/03-health-and-employment-information/federalMedicalCentersPages';
import {
  servicePeriodsPagesVeteran,
  servicePeriodInformationPage,
  handleGetItemName,
  handleAlertMaxItems,
  handleCardDescription,
  handleCancelAddTitle,
  handleCancelAddNo,
  handleDeleteTitle,
  handleDeleteDescription,
  handleDeleteNeedAtLeastOneDescription,
  handleDeleteYes,
  handleDeleteNo,
  handleCancelEditTitle,
  handleCancelEditDescription,
  handleCancelEditYes,
  handleCancelEditNo,
  handleSummaryTitle,
  handleVeteranDepends,
  handlePreparerVeteranDepends,
  handleNonVeteranDepends,
  handlePreparerNonVeteranDepends,
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
  // const expectedNumberOfFields = 1;
  // testNumberOfWebComponentFields(
  //   formConfig,
  //   servicePeriodInformationPage(true, false).schema,
  //   servicePeriodInformationPage(true, false).uiSchema,
  //   expectedNumberOfFields,
  //   pageTitle,
  // );

  // const expectedNumberOfErrors = 1;
  // testNumberOfErrorsOnSubmitForWebComponents(
  //   formConfig,
  //   servicePeriodInformationPage(true, false).schema,
  //   servicePeriodInformationPage(true, false).uiSchema,
  //   expectedNumberOfErrors,
  //   pageTitle,
  // );

  // testSubmitsWithoutErrors(
  //   formConfig,
  //   servicePeriodInformationPage(true, false).schema,
  //   servicePeriodInformationPage(true, false).uiSchema,
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

  testRender(
    formConfig,
    servicePeriodInformationPage(true, false).schema,
    servicePeriodInformationPage(true, false).uiSchema,
    pageTitle,
  );

  expect(handleGetItemName({ serviceBranch: 'AC' })).to.equal(
    'U.S. Army Air Corps',
  );

  expect(handleAlertMaxItems()).to.equal(
    'You have added the maximum number of allowed service periods for this application. You may edit or delete a service period or choose to continue the application.',
  );

  expect(
    handleCardDescription({ dateRange: { from: '19500315', to: '20000523' } }),
  ).to.equal('03/15/1950 - 05/23/2000');

  expect(
    handleCancelAddTitle({
      getItemName: handleGetItemName,
      itemData: { serviceBranch: 'AC' },
    }),
  ).to.equal('Cancel adding U.S. Army Air Corps service period');
  expect(
    handleCancelAddTitle({
      getItemName: handleGetItemName,
      itemData: { serviceBranch: null },
    }),
  ).to.equal('Cancel adding this service period');

  expect(handleCancelAddNo()).to.equal('No, keep this');

  expect(
    handleDeleteTitle({
      getItemName: handleGetItemName,
      itemData: { serviceBranch: 'AC' },
    }),
  ).to.equal(
    'Are you sure you want to remove this U.S. Army Air Corps service period?',
  );

  expect(
    handleDeleteDescription({
      getItemName: handleGetItemName,
      itemData: { serviceBranch: 'AC' },
    }),
  ).to.equal(
    'This will remove U.S. Army Air Corps and all the information from the service period records.',
  );

  expect(handleDeleteNeedAtLeastOneDescription()).to.equal(
    'If you remove this service period, we’ll take you to a screen where you can add another service period. You’ll need to list at least one service period for us to process this form.',
  );

  expect(handleDeleteYes()).to.equal('Yes, remove this');

  expect(handleDeleteNo()).to.equal('No, keep this');

  expect(
    handleCancelEditTitle({
      getItemName: handleGetItemName,
      itemData: { serviceBranch: 'AC' },
    }),
  ).to.equal('Cancel editing U.S. Army Air Corps service period?');

  expect(handleCancelEditDescription()).to.equal(
    'If you cancel, you’ll lose any changes you made on this screen and you will be returned to the service periods review page.',
  );

  expect(handleCancelEditYes()).to.equal('Yes, cancel');

  expect(handleCancelEditNo()).to.equal('No, keep this');

  expect(handleSummaryTitle({})).to.equal('Review service period records');

  expect(
    handleVeteranDepends({
      application: {
        claimant: { relationshipToVet: 'veteran' },
        applicant: { applicantRelationshipToClaimant: 'Authorized Agent/Rep' },
      },
    }),
  ).to.equal(false);

  expect(
    handlePreparerVeteranDepends({
      application: {
        claimant: { relationshipToVet: 'veteran' },
        applicant: { applicantRelationshipToClaimant: 'Authorized Agent/Rep' },
      },
    }),
  ).to.equal(true);

  expect(
    handleNonVeteranDepends({
      application: {
        claimant: { relationshipToVet: 'veteran' },
        applicant: { applicantRelationshipToClaimant: 'Authorized Agent/Rep' },
      },
    }),
  ).to.equal(false);

  expect(
    handlePreparerNonVeteranDepends({
      application: {
        claimant: { relationshipToVet: 'veteran' },
        applicant: { applicantRelationshipToClaimant: 'Authorized Agent/Rep' },
      },
    }),
  ).to.equal(false);
});
