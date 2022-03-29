// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/00-1234-schema.json';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import { VA_FORM_IDS } from 'platform/forms/constants';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import applicantInformationChapter from '../chapters/applicantInformationChapter';
import serviceHistoryChapter from '../chapters/serviceHistoryChapter';
import additionalInformationChapter from '../chapters/additionalInformationChapter';
import intermediateTutorialChapter from '../chapters/intermediateTutorialChapter';
import availableFeaturesAndUsageChapter from '../chapters/availableFeaturesAndUsageChapter';

import singleCheckbox from '../pages/singleCheckbox';
import groupCheckbox from '../pages/groupCheckbox';

// const { } = fullSchema.properties;
// const { } = fullSchema.definitions;

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'mock-1234',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_MOCK,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your Mock form application (00-1234) is in progress.',
    //   expired: 'Your saved Mock form application (00-1234) has expired. If you want to apply for Mock form, please start a new application.',
    //   saved: 'Your Mock form application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for Mock form.',
    noAuth: 'Please sign in again to continue your application for Mock form.',
  },
  title: 'Mock Form',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    // ** Complex Form
    applicantInformationChapter,
    serviceHistoryChapter,
    additionalInformationChapter,
    // ** Intermediate tutorial examples
    intermediateTutorialChapter,
    // https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/available-features-and-usage-guidelines/
    availableFeaturesAndUsageChapter,

    workarounds: {
      title: 'Chapter Title: Workarounds for form widget problems',
      pages: {
        singleCheckbox,
        groupCheckbox,
      },
    },
  },
};

export default formConfig;
