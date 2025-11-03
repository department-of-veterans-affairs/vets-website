import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-0779-nursing-home-information/constants';
import { ConfirmationPage } from '@bio-aquia/21-0779-nursing-home-information/containers/confirmation-page';
import { IntroductionPage } from '@bio-aquia/21-0779-nursing-home-information/containers/introduction-page';
import manifest from '@bio-aquia/21-0779-nursing-home-information/manifest.json';
import { transform } from '@bio-aquia/21-0779-nursing-home-information/config/transform';
import {
  createPageValidator,
  createValidationErrorHandler,
} from '@bio-aquia/shared/utils';
import { GetHelp } from '@bio-aquia/21-0779-nursing-home-information/components/get-help';
import { preSubmitSignatureConfig } from '@bio-aquia/21-0779-nursing-home-information/components/pre-submit-signature';
import {
  CertificationLevelOfCarePage,
  ClaimantQuestionPage,
  ClaimantPersonalInfoPage,
  ClaimantIdentificationInfoPage,
  NursingHomeDetailsPage,
  VeteranPersonalInfoPage,
  VeteranIdentificationInfoPage,
  NursingOfficialInformationPage,
  AdmissionDatePage,
  MedicaidFacilityPage,
  MedicaidApplicationPage,
  MedicaidStatusPage,
  MedicaidStartDatePage,
  MonthlyCostsPage,
  AdmissionDateReview,
  CertificationLevelOfCareReview,
  ClaimantIdentificationInfoReview,
  ClaimantPersonalInfoReview,
  ClaimantQuestionReview,
  MedicaidApplicationReview,
  MedicaidFacilityReview,
  MedicaidStartDateReview,
  MedicaidStatusReview,
  MonthlyCostsReview,
  NursingHomeDetailsReview,
  NursingOfficialInformationReview,
  VeteranIdentificationInfoReview,
  VeteranPersonalInfoReview,
} from '@bio-aquia/21-0779-nursing-home-information/pages';
import {
  certificationLevelOfCareSchema,
  claimantQuestionSchema,
  claimantPersonalInfoSchema,
  claimantIdentificationInfoSchema,
  nursingHomeDetailsSchema,
  veteranPersonalInfoSchema,
  veteranIdentificationInfoSchema,
  nursingOfficialInformationSchema,
  admissionDateInfoSchema,
  medicaidFacilitySchema,
  medicaidApplicationSchema,
  currentMedicaidStatusSchema,
  medicaidStartDateInfoSchema,
  monthlyCostsSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas';

const defaultSchema = {
  type: 'object',
  properties: {},
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/form210779`,
  transformForSubmit: transform,
  trackingPrefix: '21-0779-nursing-home-information-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent,
  getHelp: GetHelp,
  preSubmitInfo: preSubmitSignatureConfig,
  dev: {
    showNavLinks: false,
    collapsibleNavLinks: false,
  },
  formId: VA_FORM_IDS.FORM_21_0779,
  saveInProgress: {
    messages: {
      inProgress:
        'Your nursing home information request (21-0779) is in progress.',
      expired:
        'Your saved nursing home information request (21-0779) has expired. If you want to submit your information, please start a new request.',
      saved: 'Your nursing home information request has been saved.',
    },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {},
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    nursingOfficialPersonalChapter: {
      title: 'Your personal information',
      pages: {
        nursingOfficialInformation: {
          path: 'nursing-official-information',
          title: 'Nursing home official personal information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: NursingOfficialInformationPage,
          CustomPageReview: NursingOfficialInformationReview,
          verifyItemValues: values =>
            createPageValidator(nursingOfficialInformationSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'nursingOfficialInformation',
          ),
        },
      },
    },
    nursingHomeChapter: {
      title: 'Nursing home information',
      pages: {
        nursingHomeDetails: {
          path: 'nursing-home-details',
          title: 'Nursing home facility details',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: NursingHomeDetailsPage,
          CustomPageReview: NursingHomeDetailsReview,
          verifyItemValues: values =>
            createPageValidator(nursingHomeDetailsSchema)(values),
          onErrorChange: createValidationErrorHandler('nursingHomeDetails'),
        },
      },
    },
    patientInformationChapter: {
      title: 'Patient information',
      pages: {
        claimantQuestion: {
          path: 'claimant-question',
          title: 'Patient information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ClaimantQuestionPage,
          CustomPageReview: ClaimantQuestionReview,
          verifyItemValues: values =>
            createPageValidator(claimantQuestionSchema)(values),
          onErrorChange: createValidationErrorHandler('claimantQuestion'),
        },
        claimantPersonalInfo: {
          path: 'claimant-personal-info',
          title: 'Claimant personal information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ClaimantPersonalInfoPage,
          CustomPageReview: ClaimantPersonalInfoReview,
          depends: formData =>
            formData?.claimantQuestion?.patientType === 'spouseOrParent',
          verifyItemValues: values =>
            createPageValidator(claimantPersonalInfoSchema)(values),
          onErrorChange: createValidationErrorHandler('claimantPersonalInfo'),
        },
        claimantIdentificationInfo: {
          path: 'claimant-identification-info',
          title: 'Claimant identification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: ClaimantIdentificationInfoPage,
          CustomPageReview: ClaimantIdentificationInfoReview,
          depends: formData =>
            formData?.claimantQuestion?.patientType === 'spouseOrParent',
          verifyItemValues: values =>
            createPageValidator(claimantIdentificationInfoSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'claimantIdentificationInfo',
          ),
        },
        veteranPersonalInfo: {
          path: 'veteran-personal-info',
          title: 'Veteran personal information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: VeteranPersonalInfoPage,
          CustomPageReview: VeteranPersonalInfoReview,
          verifyItemValues: values =>
            createPageValidator(veteranPersonalInfoSchema)(values),
          onErrorChange: createValidationErrorHandler('veteranPersonalInfo'),
        },
        veteranIdentificationInfo: {
          path: 'veteran-identification-info',
          title: 'Veteran identification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: VeteranIdentificationInfoPage,
          CustomPageReview: VeteranIdentificationInfoReview,
          verifyItemValues: values =>
            createPageValidator(veteranIdentificationInfoSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'veteranIdentificationInfo',
          ),
        },
      },
    },
    levelOfCareChapter: {
      title: 'Level of care',
      pages: {
        certificationLevelOfCare: {
          path: 'certification-level-of-care',
          title: 'Level of care certification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: CertificationLevelOfCarePage,
          CustomPageReview: CertificationLevelOfCareReview,
          verifyItemValues: values =>
            createPageValidator(certificationLevelOfCareSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'certificationLevelOfCare',
          ),
        },
        admissionDate: {
          path: 'admission-date',
          title: 'Date of admission',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: AdmissionDatePage,
          CustomPageReview: AdmissionDateReview,
          verifyItemValues: values =>
            createPageValidator(admissionDateInfoSchema)(values),
          onErrorChange: createValidationErrorHandler('admissionDateInfo'),
        },
      },
    },
    medicaidChapter: {
      title: 'Medicaid',
      pages: {
        medicaidFacility: {
          path: 'medicaid-facility',
          title: 'Medicaid facility status',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MedicaidFacilityPage,
          CustomPageReview: MedicaidFacilityReview,
          verifyItemValues: values =>
            createPageValidator(medicaidFacilitySchema)(values),
          onErrorChange: createValidationErrorHandler('medicaidFacility'),
        },
        medicaidApplication: {
          path: 'medicaid-application',
          title: 'Medicaid application status',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MedicaidApplicationPage,
          CustomPageReview: MedicaidApplicationReview,
          verifyItemValues: values =>
            createPageValidator(medicaidApplicationSchema)(values),
          onErrorChange: createValidationErrorHandler('medicaidApplication'),
        },
        medicaidStatus: {
          path: 'medicaid-status',
          title: 'Medicaid status',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MedicaidStatusPage,
          CustomPageReview: MedicaidStatusReview,
          verifyItemValues: values =>
            createPageValidator(currentMedicaidStatusSchema)(values),
          onErrorChange: createValidationErrorHandler('medicaidStatus'),
        },
        medicaidStartDate: {
          path: 'medicaid-start-date',
          title: 'Medicaid start date',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MedicaidStartDatePage,
          CustomPageReview: MedicaidStartDateReview,
          depends: formData =>
            formData?.medicaidStatus?.currentlyCoveredByMedicaid === 'yes',
          verifyItemValues: values =>
            createPageValidator(medicaidStartDateInfoSchema)(values),
          onErrorChange: createValidationErrorHandler('medicaidStartDateInfo'),
        },
      },
    },
    costsChapter: {
      title: 'Cost information',
      pages: {
        monthlyCosts: {
          path: 'monthly-costs',
          title: 'Monthly costs',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MonthlyCostsPage,
          CustomPageReview: MonthlyCostsReview,
          verifyItemValues: values =>
            createPageValidator(monthlyCostsSchema)(values),
          onErrorChange: createValidationErrorHandler('monthlyCosts'),
        },
      },
    },
  },
};

export default formConfig;
export { formConfig };
