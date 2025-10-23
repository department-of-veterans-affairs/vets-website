import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
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
import dicBenefits from './chapters/04-claim-information/dicBenefits';
import nursingHome from './chapters/04-claim-information/nursingHome';
import { treatmentPages } from './chapters/04-claim-information/treatmentPages';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit,
  trackingPrefix: 'survivors-534ez',
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
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/supporting-forms-for-claims/apply-form-21p-534ez',
        label: 'Survivors benefits',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_21P_534EZ,
  saveInProgress: {
    messages: {
      inProgress: 'Your benefits application (21P-534EZ) is in progress.',
      expired:
        'Your saved benefits application (21P-534EZ) has expired. If you want to apply for benefits, please start a new application.',
      saved: 'Your benefits application has been saved.',
    },
  },
  version: 0,
  formSavedPage: FormSavedPage,
  useCustomScrollAndFocus: false,
  defaultDefinitions,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
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
      fullNamePath: 'veteranFullName',
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
    // Chapter 4
    claimInformation: {
      title: 'Claim information',
      pages: {
        dicBenefits: {
          title: 'D.I.C. benefits',
          path: 'claim-information/dic',
          uiSchema: dicBenefits.uiSchema,
          schema: dicBenefits.schema,
        },
        ...treatmentPages,
        nursingHome: {
          title: 'Nursing home or increased survivor entitlement',
          path: 'claim-information/nursing-home',
          uiSchema: nursingHome.uiSchema,
          schema: nursingHome.schema,
        },
      },
    },
  },
};

export default formConfig;
