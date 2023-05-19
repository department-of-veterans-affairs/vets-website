import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import manifest from '../manifest.json';
import GetFormHelp from '../components/GetFormHelp';
import PreSubmitSignature from '../components/PreSubmitSignature';
import { transform } from '../utils/transform';
import { SubmissionAlert } from '../components/Alerts';
import { WIZARD_STATUS } from '../wizard/constants';
import submitForm from './submitForm';
import veteranInformationChapter from './chapters/veteranInformationChapter';
import householdIncomeChapter from './chapters/householdIncomeChapter';
import householdAssetsChapter from './chapters/householdAssetsChapter';
import householdExpensesChapter from './chapters/householdExpensesChapter';
import resolutionOptionsChapter from './chapters/resolutionOptionsChapter';
import bankruptcyAttestationChapter from './chapters/bankruptcyAttestationChapter';

const APPLICATION_NAME = 'Your application for financial hardship assistance';
const messagesConfig = {
  savedFormMessages: {
    notFound: `Please start over to submit an application for ${APPLICATION_NAME}.`,
    noAuth: `Please sign in again to continue ${APPLICATION_NAME}.`,
  },
  saveInProgress: {
    messages: {
      inProgress: `${APPLICATION_NAME} is in progress.`,
      expired: `${APPLICATION_NAME} has expired. If you want to submit a application for ${APPLICATION_NAME}, please start a new application.`,
      saved: `${APPLICATION_NAME} has been saved.`,
    },
  },
};

const chaptersConfig = {
  chapters: {
    veteranInformationChapter,
    householdIncomeChapter,
    householdAssetsChapter,
    householdExpensesChapter,
    resolutionOptionsChapter,
    bankruptcyAttestationChapter,
  },
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit: transform,
  submitUrl: `${environment.API_URL}/v0/financial_status_reports`,
  submit: submitForm,
  submissionError: SubmissionAlert,
  trackingPrefix: 'fsr-5655-',
  wizardStorageKey: WIZARD_STATUS,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: PreSubmitSignature,
  formId: VA_FORM_IDS.FORM_5655,
  version: 0,
  prefillEnabled: true,
  defaultDefinitions: {},
  title: 'Request help with VA debt for overpayments and copay bills',
  subTitle: 'Financial Status Report (VA Form 5655)',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  customText: {
    finishAppLaterMessage: 'Finish this request later',
    reviewPageTitle: 'Review your request',
    submitButtonText: 'Submit your request',
  },
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: true,
  ...messagesConfig,
  ...chaptersConfig,
};

export default formConfig;
