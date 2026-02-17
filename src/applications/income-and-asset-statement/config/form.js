// import fullSchema from 'vets-json-schema/dist/21P-0969-schema.json';
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import PreSubmitInfo from '../containers/PreSubmitInfo';

import manifest from '../manifest.json';
import prefillTransformer from './prefill-transformer';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { submit } from './submit';
import veteranAndClaimantInformation from './chapters/01-veteran-and-claimant-information';
import unassociatedIncomes from './chapters/02-unassociated-incomes';
import associatedIncomes from './chapters/03-associated-incomes';
import ownedAssets from './chapters/04-owned-assets';
import royaltiesAndOtherProperties from './chapters/05-royalties-and-other-properties';
import assetTransfers from './chapters/06-asset-transfers';
import trusts from './chapters/07-trusts';
import annuities from './chapters/08-annuities';
import unreportedAssets from './chapters/09-unreported-assets';
import discontinuedIncomes from './chapters/10-discontinued-incomes';
import incomeReceiptWaivers from './chapters/11-income-receipt-waivers';
import supportingDocuments from './chapters/12-supporting-documents';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: 'form0969',
  submit,
  trackingPrefix: 'income-and-asset-statement-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  showReviewErrors: !environment.isProduction() && !environment.isStaging(),
  formId: VA_FORM_IDS.FORM_21P_0969,
  formOptions: {
    focusOnAlertRole: true,
    useWebComponentForNavigation: true,
  },
  customText: {
    appType: 'form',
  },
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your benefits application (21P-0969) is in progress.',
    //   expired: 'Your saved benefits application (21P-0969) has expired. If you want to apply for benefits, please start a new application.',
    //   saved: 'Your benefits application has been saved.',
    // },
  },
  version: 0,
  migrations: [],
  prefillEnabled: true,
  prefillTransformer,
  dev: {
    disableWindowUnloadInCI: true,
  },
  downtime: {
    requiredForPrefill: false,
    dependencies: [],
  },

  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      {
        href: '/',
        label: 'VA.gov home',
      },
      {
        href: '/supporting-forms-for-claims',
        label: 'Supporting forms for VA claims',
      },
      {
        href:
          '/supporting-forms-for-claims/submit-income-and-asset-statement-form-21p-0969',
        label: 'Submit a pension or DIC income and asset statement',
      },
    ],
  }),
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  preSubmitInfo: {
    CustomComponent: PreSubmitInfo,
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: formData =>
        formData?.claimantType === 'VETERAN'
          ? 'veteranFullName'
          : 'claimantFullName',
    },
  },
  title: 'Pension or DIC Income and Asset Statement',
  subTitle: 'VA Form 21P-0969',
  defaultDefinitions: {},
  chapters: {
    veteranAndClaimantInformation,
    unassociatedIncomes,
    associatedIncomes,
    ownedAssets,
    royaltiesAndOtherProperties,
    assetTransfers,
    trusts,
    annuities,
    unreportedAssets,
    discontinuedIncomes,
    incomeReceiptWaivers,
    supportingDocuments,
  },
};

export default formConfig;
