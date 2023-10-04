// platform imports
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

// internal app imports
import manifest from '../manifest.json';
import content from '../locales/en/content.json';
import { prefillTransformer } from '../utils/helpers/prefill-transformer';
import { submitTransformer } from '../utils/helpers/submit-transformer';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import DowntimeWarning from '../components/FormAlerts/DowntimeWarning';
import SubmissionErrorAlert from '../components/FormAlerts/SubmissionErrorAlert';
import PreSubmitNotice from '../components/PreSubmitNotice';
import GetFormHelp from '../components/GetFormHelp';

// chapter 1 - Veteran Information
import VeteranProfileInformation from '../components/FormPages/VeteranProfileInformation';

const formConfig = {
  title: content['form-title'],
  subTitle: content['form-subtitle'],
  formId: VA_FORM_IDS.FORM_10_10EZR,
  version: 0,
  trackingPrefix: 'ezr-',
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/health_care_applications`,
  transformForSubmit: submitTransformer,
  prefillEnabled: true,
  prefillTransformer,
  saveInProgress: {
    messages: {
      inProgress: content['sip-message-in-progress'],
      expired: content['sip-message-expired'],
      saved: content['sip-message-saved'],
    },
  },
  customText: {
    appType: content['sip-text-app-type'],
    appAction: content['sip-text-app-action'],
    continueAppButtonText: content['sip-text-continue-btn-text'],
    startNewAppButtonText: content['sip-text-start-new-btn-text'],
    appSavedSuccessfullyMessage: content['sip-text-app-saved-message'],
    finishAppLaterMessage: content['sip-text-finish-later'],
    reviewPageTitle: content['sip-text-review-page-title'],
    submitButtonText: content['sip-text-submit-btn-text'],
  },
  savedFormMessages: {
    notFound: content['sip-savedform-not-found'],
    noAuth: content['sip-savedform-no-auth'],
  },
  preSubmitInfo: {
    required: true,
    field: 'privacyAgreementAccepted',
    CustomComponent: PreSubmitNotice,
  },
  submissionError: SubmissionErrorAlert,
  downtime: {
    dependencies: [externalServices.es],
    message: DowntimeWarning,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  getHelp: GetFormHelp,
  defaultDefinitions: {},
  chapters: {
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        veteranProfileInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran\u2019s personal information',
          CustomPage: VeteranProfileInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },
  },
};

export default formConfig;
