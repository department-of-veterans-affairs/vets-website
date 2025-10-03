import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-0779-nursing-home-information/constants';
import ConfirmationPage from '@bio-aquia/21-0779-nursing-home-information/containers/confirmation-page';
import IntroductionPage from '@bio-aquia/21-0779-nursing-home-information/containers/introduction-page';
import manifest from '@bio-aquia/21-0779-nursing-home-information/manifest.json';
import {
  createPageValidator,
  createValidationErrorHandler,
} from '@bio-aquia/shared/utils';
import prefillTransformer from '@bio-aquia/21-0779-nursing-home-information/config/prefill-transformer';
import GetHelpFooter from '@bio-aquia/21-0779-nursing-home-information/components/get-help';
import PreSubmitInfo from '@bio-aquia/21-0779-nursing-home-information/components/pre-submit-info';
import {
  CertificationLevelOfCarePage,
  ClaimantQuestionPage,
  ClaimantPersonalInfoPage,
  ClaimantIdentificationInfoPage,
  MedicaidAndCostPage,
  NursingHomeDetailsPage,
  OfficialInfoAndSignaturePage,
  VeteranPersonalInfoPage,
  VeteranIdentificationInfoPage,
  NursingOfficialInformationPage,
  AdmissionDatePage,
} from '@bio-aquia/21-0779-nursing-home-information/pages';
import {
  certificationLevelOfCareSchema,
  claimantQuestionSchema,
  claimantPersonalInfoSchema,
  claimantIdentificationInfoSchema,
  medicaidAndCostSchema,
  nursingHomeDetailsSchema,
  officialInfoAndSignatureSchema,
  veteranPersonalInfoSchema,
  veteranIdentificationInfoSchema,
  nursingOfficialInformationSchema,
  admissionDateInfoSchema,
} from '../schemas';

const defaultSchema = {
  type: 'object',
  properties: {},
};

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/form21_0779',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21-0779-nursing-home-information-',
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent,
  getHelp: GetHelpFooter,
  preSubmitInfo: PreSubmitInfo,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
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
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to submit your nursing home information.',
    noAuth: 'Please sign in again to continue your request.',
  },
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
          CustomPageReview: null,
          pagePerItemIndex: 0,
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
      // nursing home name and address
      pages: {
        nursingHomeDetails: {
          path: 'nursing-home-details',
          title: 'Nursing home facility details',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: NursingHomeDetailsPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
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
          CustomPageReview: null,
          pagePerItemIndex: 0,
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
          CustomPageReview: null,
          pagePerItemIndex: 0,
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
          CustomPageReview: null,
          pagePerItemIndex: 0,
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
          CustomPageReview: null,
          pagePerItemIndex: 0,
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
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(veteranIdentificationInfoSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'veteranIdentificationInfo',
          ),
        },
      },
    },
    levelOfCareChapter: {
      title: 'Certification',
      pages: {
        // certification level of care question
        // date of admission to nursing home
        certificationLevelOfCare: {
          path: 'certification-level-of-care',
          title: 'Level of care certification',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: CertificationLevelOfCarePage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
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
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(admissionDateInfoSchema)(values),
          onErrorChange: createValidationErrorHandler('admissionDateInfo'),
        },
      },
    },
    medicaidChapter: {
      title: 'Medicaid',
      // is nursing home medicaid approved
      // has the patient applied for medicaid
      // date medicaid coverage started
      pages: {
        officialInfoAndSignature: {
          path: 'official-info-and-signature',
          title: "Official's information and signature",
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: OfficialInfoAndSignaturePage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(officialInfoAndSignatureSchema)(values),
          onErrorChange: createValidationErrorHandler(
            'officialInfoAndSignature',
          ),
        },
      },
    },
    costsChapter: {
      title: 'Nursing home information',
      // monthly out of pocket costs
      pages: {
        medicaidAndCost: {
          path: 'medicaid-and-cost',
          title: 'Medicaid and cost information',
          uiSchema: {},
          schema: defaultSchema,
          CustomPage: MedicaidAndCostPage,
          CustomPageReview: null,
          pagePerItemIndex: 0,
          verifyItemValues: values =>
            createPageValidator(medicaidAndCostSchema)(values),
          onErrorChange: createValidationErrorHandler('medicaidAndCost'),
        },
      },
    },
  },
};

export default formConfig;
