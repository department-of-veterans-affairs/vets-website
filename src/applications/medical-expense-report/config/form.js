import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import GetFormHelp from '../components/GetFormHelp';
import FormSavedPage from '../components/FormSavedPage';
import { submit } from './submit';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ErrorText from '../components/ErrorText';
import migrations from '../migrations';
import manifest from '../manifest.json';
import { defaultDefinitions } from './definitions';
import applicantInformation from './chapters/01-applicant-information';
import expenses from './chapters/02-expenses';
import additionalInformation from './chapters/03-additional-information';

const formConfig = {
  formId: VA_FORM_IDS.FORM_21P_8416,
  version: 1,
  migrations,
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'pensions-8416-',
  v3SegmentedProgressBar: true,
  prefillEnabled: true,
  dev: {
    disableWindowUnloadInCI: true,
  },
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  useCustomScrollAndFocus: false,
  defaultDefinitions,
  title: 'Submit Medical Expense Report',
  subTitle: 'Medical Expense Report (VA Form 21P-8416)',
  formOptions: {
    useWebComponentForNavigation: true,
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your medical expense report is in progress.',
      expired:
        'Your saved medical expense report has expired. If you want to submit a Medical Expense Report (21P-8416), please submit a new expense report.',
      saved: 'We saved your medical expense report',
    },
  },
  formSavedPage: FormSavedPage,
  savedFormMessages: {
    notFound: 'Please start over to submit a medical expense report.',
    noAuth: 'Please sign in again to resume your medical expense report.',
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
