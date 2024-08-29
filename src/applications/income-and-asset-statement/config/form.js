// import fullSchema from 'vets-json-schema/dist/21P-0969-schema.json';
import { VA_FORM_IDS } from 'platform/forms/constants';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { submit } from './submit';
import veteranInformation from './chapters/01-veteran-information';
import claimantInformation from './chapters/02-claimant-information';
import unassociatedIncomes from './chapters/03-unassociated-incomes';
import associatedIncomes from './chapters/04-associated-incomes';
import ownedAssets from './chapters/05-owned-assets';
import royaltiesAndOtherProperties from './chapters/06-royalties-and-other-properties';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: 'form0969',
  submit,
  trackingPrefix: 'income-and-asset-statement-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_21P_0969,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (21P-0969) is in progress.',
    //   expired: 'Your saved benefits application (21P-0969) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'veteranFullName',
    },
  },
  title: '21P-0969 Income and Asset Statement Form',
  defaultDefinitions: {},
  chapters: {
    veteranInformation,
    claimantInformation,
    unassociatedIncomes,
    associatedIncomes,
    ownedAssets,
    royaltiesAndOtherProperties,
  },
};

export default formConfig;
