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
import militaryHistory from './chapters/02-military-history';
import healthAndEmploymentInformation from './chapters/03-health-and-employment-information';
import householdInformation from './chapters/04-household-information';
import financialInformation from './chapters/05-financial-information';
import additionalInformation from './chapters/06-additional-information';

const formConfig = {
  formId: VA_FORM_IDS.FORM_21P_527EZ,
  version: migrations.length,
  migrations,
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'pensions-527EZ-',
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
  title: 'Apply for Veterans Pension benefits',
  subTitle: 'Application for Veterans Pension (VA Form 21P-527EZ)',
  formOptions: {
    useWebComponentForNavigation: true,
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your Veterans Pension benefits application is in progress.',
      expired:
        'Your saved Veterans pension benefits has expired. If you want to apply for Veterans pension benefits application (21-527EZ), please start a new application.',
      saved: 'We saved your Veterans Pension benefits application',
    },
  },
  formSavedPage: FormSavedPage,
  savedFormMessages: {
    notFound: 'Please start over to apply for pension benefits.',
    noAuth:
      'Please sign in again to resume your application for pension benefits.',
  },
  preSubmitInfo: {
    statementOfTruth: {
      body: 'I confirm that the identifying information in this form is accurate and has been represented correctly.',
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
    militaryHistory,
    healthAndEmploymentInformation,
    householdInformation,
    financialInformation,
    additionalInformation,
  },
};

export default formConfig;
