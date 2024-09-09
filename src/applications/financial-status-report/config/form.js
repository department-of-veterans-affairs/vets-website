import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import manifest from '../manifest.json';
import GetFormHelp from '../components/shared/GetFormHelp';
import PreSubmitSignature from '../components/shared/PreSubmitSignature';
import { transform } from '../utils/transform';
import { SubmissionAlert } from '../components/alerts/Alerts';
import { WIZARD_STATUS } from '../wizard/constants';
import submitForm from './submitForm';
import veteranInformationChapter from './chapters/veteranInformationChapter';
import householdIncomeChapter from './chapters/householdIncomeChapter';
import householdAssetsChapter from './chapters/householdAssetsChapter';
import householdExpensesChapter from './chapters/householdExpensesChapter';
import resolutionOptionsChapter from './chapters/resolutionOptionsChapter';
import bankruptcyAttestationChapter from './chapters/bankruptcyAttestationChapter';
import reviewErrors from '../constants/reviewErrors';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit: transform,
  // NOTE: submitUrl may be altered in submitForm by a feature flag
  submitUrl: `${environment.API_URL}/debts_api/v0/financial_status_reports`,
  submit: submitForm,
  submissionError: SubmissionAlert,
  trackingPrefix: 'fsr-5655-',
  wizardStorageKey: WIZARD_STATUS,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  preSubmitInfo: PreSubmitSignature,
  formId: VA_FORM_IDS.FORM_5655,
  version: 0,
  prefillEnabled: true,
  downtime: {
    dependencies: [
      externalServices.mvi,
      externalServices.vbs,
      externalServices.dmc,
      externalServices.vaProfile,
    ],
  },
  defaultDefinitions: {},
  savedFormMessages: {
    notFound:
      'Please start over to submit an application for financial hardship assistance.',
    noAuth:
      'Please sign in again to continue your application for financial hardship assistance.',
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your application for financial hardship assistance is in progress.',
      expired:
        'Your saved application for financial hardship assistance has expired. If you want to submit a application for financial hardship assistance, please start a new application for financial hardship assistance.',
      saved:
        'Your application for financial hardship assistance has been saved.',
    },
  },
  title: 'Request help with VA debt for overpayments and copay bills',
  subTitle: 'Financial Status Report (VA Form 5655)',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  customText: {
    finishAppLaterMessage: 'Finish this request later',
    reviewPageTitle: 'Review your request',
    submitButtonText: 'Submit your request',
  },
  showReviewErrors: !environment.isProduction(),
  reviewErrors,
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
  chapters: {
    ...veteranInformationChapter,
    ...householdIncomeChapter,
    ...householdAssetsChapter,
    ...householdExpensesChapter,
    ...resolutionOptionsChapter,
    ...bankruptcyAttestationChapter,
  },
};

export default formConfig;
