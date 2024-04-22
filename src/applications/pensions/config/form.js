import { externalServices } from 'platform/monitoring/DowntimeNotification';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import GetFormHelp from '../components/GetFormHelp';

import { submit } from '../helpers';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ErrorText from '../components/ErrorText';

import migrations from '../migrations';

import manifest from '../manifest.json';

import { defaultDefinitions } from './definitions';

// chapter-pages
import applicantInformation from './chapters/01-applicant-information';
import militaryHistory from './chapters/02-military-history';
import healthAndEmploymentInformation from './chapters/03-health-and-employment-information';
import householdInformation from './chapters/04-household-information';
import financialInformation from './chapters/05-financial-information';
import additionalInformation from './chapters/06-additional-information';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'pensions-527EZ-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  formId: VA_FORM_IDS.FORM_21P_527EZ,
  saveInProgress: {
    messages: {
      inProgress: 'Your Veterans pension benefits is in progress.',
      expired:
        'Your saved Veterans pension benefits has expired. If you want to apply for Veterans pension benefits application (21-527EZ), please start a new application.',
      saved: 'Your Veterans pension benefits application has been saved.',
    },
  },
  version: 9,
  migrations,
  prefillEnabled: true,
  // verifyRequiredPrefill: true,
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  // beforeLoad: props => { console.log('form config before load', props); },
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('form loaded', formData, savedForms, returnUrl, formConfig, router);
  // },
  savedFormMessages: {
    notFound: 'Please start over to apply for pension benefits.',
    noAuth:
      'Please sign in again to resume your application for pension benefits.',
  },
  title: 'Apply for Veterans Pension benefits',
  subTitle: 'VA Form 21P-527EZ',
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'veteranFullName',
    },
  },
  // showReviewErrors: true,
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: false,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions,
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
