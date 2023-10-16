// platform imports
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

// internal app imports
import manifest from '../manifest.json';
import content from '../locales/en/content.json';
import { SHARED_PATHS } from '../utils/constants';
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
import veteranDateOfBirth from './chapters/veteranInformation/dateOfBirth';
import veteranBirthSex from './chapters/veteranInformation/birthSex';
import veteranGenderIdentity from './chapters/veteranInformation/genderIdentity';
import veteranMailingAddress from './chapters/veteranInformation/mailingAddress';
import veteranHomeAddress from './chapters/veteranInformation/homeAddress';
import veteranContantInformation from './chapters/veteranInformation/contactInformation';

// chapter 3 - Insurance Information
import medicaidEligibility from './chapters/insuranceInformation/medicaid';
import medicarePartAEnrollment from './chapters/insuranceInformation/medicare';
import partAEffectiveDate from './chapters/insuranceInformation/partAEffectiveDate';
import insurancePolicies from './chapters/insuranceInformation/insurancePolicies';
import InsuranceSummaryPage from '../components/FormPages/InsuranceSummary';
import InsurancePolicyInformationPage from '../components/FormPages/InsurancePolicyInformation';
import InsurancePolicyReviewPage from '../components/FormReview/InsurancePolicyReviewPage';

// declare shared paths for custom form page navigation
const { insurance: INSURANCE_PATHS } = SHARED_PATHS;

// declare form config object
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
        profileInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran\u2019s personal information',
          CustomPage: VeteranProfileInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        dateOfBirth: {
          path: 'veteran-information/date-of-birth',
          title: 'Veteran\u2019s date of birth',
          initialData: {},
          depends: formData => !formData['view:userDob'],
          uiSchema: veteranDateOfBirth.uiSchema,
          schema: veteranDateOfBirth.schema,
        },
        birthSex: {
          path: 'veteran-information/birth-sex',
          title: 'Veteran\u2019s sex assigned at birth',
          initialData: {},
          depends: formData => !formData['view:userGender'],
          uiSchema: veteranBirthSex.uiSchema,
          schema: veteranBirthSex.schema,
        },
        genderIdentity: {
          path: 'veteran-information/gender-identity',
          title: 'Veteran\u2019s gender identity',
          initialData: {},
          depends: formData => !formData['view:isSigiEnabled'],
          uiSchema: veteranGenderIdentity.uiSchema,
          schema: veteranGenderIdentity.schema,
        },
        mailingAddress: {
          path: 'veteran-information/mailing-address',
          title: 'Veteran\u2019s mailing address',
          initialData: {},
          uiSchema: veteranMailingAddress.uiSchema,
          schema: veteranMailingAddress.schema,
        },
        homeAddress: {
          path: 'veteran-information/home-address',
          title: 'Veteran\u2019s home address',
          initialData: {},
          depends: formData => !formData['view:doesMailingMatchHomeAddress'],
          uiSchema: veteranHomeAddress.uiSchema,
          schema: veteranHomeAddress.schema,
        },
        contactInformation: {
          path: 'veteran-information/contact-information',
          title: 'Veteran\u2019s contact information',
          initialData: {},
          uiSchema: veteranContantInformation.uiSchema,
          schema: veteranContantInformation.schema,
        },
      },
    },
    insuranceInformation: {
      title: 'Insurance information',
      pages: {
        medicaidEligibility: {
          path: 'insurance-information/medicaid-eligibility',
          title: 'Medicaid eligibility',
          initialData: {},
          uiSchema: medicaidEligibility.uiSchema,
          schema: medicaidEligibility.schema,
        },
        medicarePartAEnrollment: {
          path: 'insurance-information/medicare-part-a-enrollment',
          title: 'Medicare Part A enrollment',
          initialData: {},
          uiSchema: medicarePartAEnrollment.uiSchema,
          schema: medicarePartAEnrollment.schema,
        },
        medicarePartAEffectiveDate: {
          path: 'insurance-information/medicare-part-a-effective-date',
          title: 'Medicare Part A effective date',
          initialData: {},
          depends: formData => formData.isEnrolledMedicarePartA,
          uiSchema: partAEffectiveDate.uiSchema,
          schema: partAEffectiveDate.schema,
        },
        insurancePolicies: {
          path: INSURANCE_PATHS.summary,
          title: 'Insurance policies',
          CustomPage: InsuranceSummaryPage,
          CustomPageReview: InsurancePolicyReviewPage,
          uiSchema: insurancePolicies.uiSchema,
          schema: insurancePolicies.schema,
        },
        insurancePolicyInformation: {
          path: INSURANCE_PATHS.info,
          title: 'Insurance policy information',
          depends: formData => !formData['view:skipDependentInfo'],
          CustomPage: InsurancePolicyInformationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },
  },
};

export default formConfig;
