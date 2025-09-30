import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../utils/constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import FormSavedPage from '../containers/FormSavedPage';
import { submit } from './submit';
import { defaultDefinitions } from './definitions';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';
import applicantInformation from './chapters/01-applicant-information';
import expenses from './chapters/02-expenses';
import additionalInformation from './chapters/03-additional-information';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit,
  trackingPrefix: 'med-expense-8416',
  v3SegmentedProgressBar: true,
  prefillEnabled: true,
  dev: {
    disableWindowUnloadInCI: true,
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  formId: VA_FORM_IDS.FORM_21P_8416,
  useCustomScrollAndFocus: false,
  defaultDefinitions,
  saveInProgress: {
    messages: {
      inProgress: 'Your medical expense report is in progress.',
      expired:
        'Your saved medical expense report has expired. If you want to submit a Medical Expense Report (21P-8416), please submit a new expense report.',
      saved: 'We saved your medical expense report',
    },
  },
  version: 0,
  formSavedPage: FormSavedPage,
  savedFormMessages: {
    notFound: 'Please start over to submit a medical expense report.',
    noAuth: 'Please sign in again to resume your medical expense report.',
  },
  formOptions: {
    useWebComponentForNavigation: true,
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'claimantFullName',
    },
  },
  title: TITLE,
  subTitle: SUBTITLE,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  showReviewErrors: !environment.isProduction() && !environment.isStaging(),
  chapters: {
    applicantInformation,
    expenses,
    additionalInformation,
  },
};

export default formConfig;
