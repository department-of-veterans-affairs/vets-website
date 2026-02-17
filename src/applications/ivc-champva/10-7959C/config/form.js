import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import environment from 'platform/utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import get from 'platform/utilities/data/get';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PreSubmitInfo from '../components/PreSubmitInfo';
import FormFooter from '../components/FormFooter';
import prefillTransformer from './prefillTransformer';
import transformForSubmit from './submitTransformer';
import { nameWording, privWrapper } from '../../shared/utilities';
import SubmissionError from '../../shared/components/SubmissionError';
import migrations from './migrations';
import { blankSchema } from '../definitions';

import { beneficiaryPages } from '../chapters/applicantInformation';

import medicareReportPlans from '../chapters/medicare/reportPlans';
import medicarePlanTypes from '../chapters/medicare/planTypes';
import medicarePharmacyBenefits from '../chapters/medicare/planPharmacyBenefits';
import medicarePartACarrier from '../chapters/medicare/partACarrier';
import medicarePartBCarrier from '../chapters/medicare/partBCarrier';
import medicareCardUpload from '../chapters/medicare/partsABCardUpload';
import medicarePartDStatus from '../chapters/medicare/partDStatus';
import medicarePartDCarrier from '../chapters/medicare/partDCarrier';
import medicarePartDCardUpload from '../chapters/medicare/partDCardUpload';
import { medicarePagesRev2025 } from '../chapters/medicare';

import {
  applicantHasInsuranceSchema,
  applicantProviderSchema,
  applicantInsuranceEobSchema,
  applicantInsuranceSOBSchema,
  applicantInsuranceThroughEmployerSchema,
  applicantInsurancePrescriptionSchema,
  applicantInsuranceTypeSchema,
  applicantMedigapSchema,
  applicantInsuranceCommentsSchema,
  applicantInsuranceCardSchema,
} from '../chapters/healthInsuranceInformation';
import { healthInsuranceRev2025Pages } from '../chapters/healthInsurance';

import benefitStatus from '../chapters/signerInformation/benefitStatus';
import certifierEmail from '../chapters/signerInformation/certifierEmail';
import certifierRole from '../chapters/signerInformation/certifierRole';
import NotEnrolledPage from '../components/FormPages/NotEnrolledPage';
import { FEATURE_TOGGLES } from '../hooks/useDefaultFormData';

// import mockdata from '../tests/e2e/fixtures/data/test-data.json';

// (First Name Posessive);
function fnp(formData) {
  return nameWording(formData, undefined, undefined, true);
}

const REV2025_TOGGLE_KEY = `view:${FEATURE_TOGGLES[0]}`;

/** @type {PageSchema} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  trackingPrefix: '10-7959C-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  footerContent: FormFooter,
  submissionError: SubmissionError,
  formId: '10-7959C',
  dev: {
    collapsibleNavLinks: true,
    disableWindowUnloadInCI: true,
    showNavLinks: false,
  },
  formOptions: {
    useWebComponentForNavigation: true,
    filterInactiveNestedPageData: true,
  },
  downtime: {
    dependencies: [externalServices.pega, externalServices.form107959c],
  },
  preSubmitInfo: PreSubmitInfo,
  customText: {
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    reviewPageTitle: 'Review and sign',
    startNewAppButtonText: 'Start a new form',
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your CHAMPVA other health insurance certification application (10-7959C) is in progress.',
      expired:
        'Your saved CHAMPVA other health insurance certification application (10-7959C) has expired. If you want to apply for CHAMPVA other health insurance certification, please start a new application.',
      saved:
        'Your CHAMPVA other health insurance certification application has been saved.',
    },
  },
  version: migrations.length,
  migrations,
  prefillEnabled: true,
  prefillTransformer,
  transformForSubmit,
  savedFormMessages: {
    notFound:
      'Please start over to apply for CHAMPVA other health insurance certification.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA other health insurance certification.',
  },
  title: 'Submit other health insurance',
  subTitle: 'CHAMPVA Other Health Insurance Certification (VA Form 10-7959c)',
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      {
        href: '/family-and-caregiver-benefits/',
        label: 'VA benefits for family and caregivers',
      },
      {
        href: '/family-and-caregiver-benefits/health-and-disability/',
        label: 'Health and disability benefits for family and caregivers',
      },
      {
        href: '/family-and-caregiver-benefits/health-and-disability/champva/',
        label: 'CHAMPVA benefits',
      },
      {
        href: '#content',
        label: 'Submit other health insurance',
      },
    ],
    homeVeteransAffairs: true,
    wrapping: true,
  }),
  defaultDefinitions: {},
  chapters: {
    formSignature: {
      title: 'Signer information',
      pages: {
        formSignature: {
          // initialData: mockdata.data,
          path: 'form-signature',
          title: 'Signer role',
          ...certifierRole,
        },
        ohiScreen: {
          path: 'champva-screen',
          title: 'Beneficiary’s CHAMPVA benefit status',
          ...benefitStatus,
        },
        benefitApp: {
          path: 'benefit-application',
          title: 'Apply for Benefits',
          depends: formData => !get('view:champvaBenefitStatus', formData),
          CustomPage: NotEnrolledPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: blankSchema,
        },
        signerEmail: {
          path: 'signer-email',
          title: 'Signer’s email address',
          ...certifierEmail,
        },
      },
    },
    beneficiaryInformation: {
      title: 'Beneficiary information',
      pages: beneficiaryPages,
    },
    medicareInformation: {
      title: 'Medicare information',
      pages: {
        ...medicarePagesRev2025,
        hasMedicareAB: {
          path: 'medicare-ab-status',
          title: 'Report Medicare plans',
          depends: formData => !formData[REV2025_TOGGLE_KEY],
          ...medicareReportPlans,
        },
        medicareClass: {
          path: 'medicare-plan',
          title: 'Medicare plan types',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantMedicareStatus', formData),
          ...medicarePlanTypes,
        },
        pharmacyBenefits: {
          path: 'medicare-pharmacy',
          title: 'Medicare pharmacy benefits',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantMedicareStatus', formData) &&
            ['advantage', 'other'].includes(
              get('applicantMedicareClass', formData),
            ),
          ...medicarePharmacyBenefits,
        },
        partACarrier: {
          path: 'medicare-a-carrier',
          title: 'Medicare Part A carrier',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantMedicareStatus', formData),
          ...medicarePartACarrier,
        },
        partBCarrier: {
          path: 'medicare-b-carrier',
          title: 'Medicare Part B carrier',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantMedicareStatus', formData),
          ...medicarePartBCarrier,
        },
        medicareABCards: {
          path: 'medicare-ab-upload',
          title: 'Medicare card for hospital and medical coverage',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantMedicareStatus', formData),
          ...medicareCardUpload,
        },
        hasMedicareD: {
          path: 'medicare-d-status',
          title: 'Medicare Part D status',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantMedicareStatus', formData),
          ...medicarePartDStatus,
        },
        partDCarrier: {
          path: 'medicare-d-carrier',
          title: 'Medicare Part D carrier',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantMedicareStatus', formData) &&
            get('applicantMedicareStatusD', formData),
          ...medicarePartDCarrier,
        },
        medicareDCards: {
          path: 'medicare-d-upload',
          title: 'Medicare Part D card',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantMedicareStatus', formData) &&
            get('applicantMedicareStatusD', formData),
          ...medicarePartDCardUpload,
        },
      },
    },
    healthcareInformation: {
      title: 'Health insurance information',
      pages: {
        ...healthInsuranceRev2025Pages,
        hasPrimaryHealthInsurance: {
          path: 'insurance-status',
          depends: formData => !formData[REV2025_TOGGLE_KEY],
          title: formData => privWrapper(`${fnp(formData)} health insurance`),
          ...applicantHasInsuranceSchema(true),
        },
        primaryType: {
          path: 'insurance-plan',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantPrimaryProvider
              } insurance plan`,
            ),
          ...applicantInsuranceTypeSchema(true),
        },
        primaryMedigap: {
          path: 'insurance-medigap',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantPrimaryInsuranceType', formData) === 'medigap',
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantPrimaryProvider
              } Medigap information`,
            ),
          ...applicantMedigapSchema(true),
        },
        primaryProvider: {
          path: 'insurance-info',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData),
          title: formData =>
            privWrapper(`${fnp(formData)} health insurance information`),
          ...applicantProviderSchema(true),
        },
        primaryThroughEmployer: {
          path: 'insurance-type',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} type of insurance for ${
                formData.applicantPrimaryProvider
              }`,
            ),
          ...applicantInsuranceThroughEmployerSchema(true),
        },
        primaryPrescription: {
          path: 'insurance-prescription',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantPrimaryProvider
              } prescription coverage`,
            ),
          ...applicantInsurancePrescriptionSchema(true),
        },
        primaryEob: {
          path: 'insurance-eob',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantPrimaryHasPrescription', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantPrimaryProvider
              } explanation of benefits`,
            ),
          ...applicantInsuranceEobSchema(true),
        },
        primaryScheduleOfBenefits: {
          path: 'insurance-sob',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantPrimaryHasPrescription', formData) &&
            !get('applicantPrimaryEob', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantPrimaryProvider
              } schedule of benefits`,
            ),
          ...applicantInsuranceSOBSchema(true),
        },
        primaryCard: {
          path: 'insurance-upload',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData),
          title: formData =>
            privWrapper(`${fnp(formData)} health insurance card`),
          ...applicantInsuranceCardSchema(true),
        },
        primaryComments: {
          path: 'insurance-comments',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantPrimaryProvider
              } additional comments`,
            ),
          ...applicantInsuranceCommentsSchema(true),
        },
        hasSecondaryHealthInsurance: {
          path: 'secondary-insurance',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData),
          title: formData =>
            privWrapper(`${fnp(formData)} additional health insurance`),
          ...applicantHasInsuranceSchema(false),
        },
        secondaryType: {
          path: 'secondary-insurance-plan',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantSecondaryProvider
              } insurance plan`,
            ),
          ...applicantInsuranceTypeSchema(false),
        },
        secondaryMedigap: {
          path: 'secondary-insurance-medigap',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData) &&
            get('applicantSecondaryInsuranceType', formData) === 'medigap',
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantSecondaryProvider
              } Medigap information`,
            ),
          ...applicantMedigapSchema(false),
        },
        secondaryProvider: {
          path: 'secondary-insurance-info',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            privWrapper(`${fnp(formData)} health insurance information`),
          ...applicantProviderSchema(false),
        },
        secondaryThroughEmployer: {
          path: 'secondary-insurance-type',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} type of insurance for ${
                formData.applicantSecondaryProvider
              }`,
            ),
          ...applicantInsuranceThroughEmployerSchema(false),
        },
        secondaryPrescription: {
          path: 'secondary-insurance-prescription',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantSecondaryProvider
              } prescription coverage`,
            ),
          ...applicantInsurancePrescriptionSchema(false),
        },
        secondaryEob: {
          path: 'secondary-insurance-eob',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData) &&
            get('applicantSecondaryHasPrescription', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantSecondaryProvider
              } explanation of benefits`,
            ),
          ...applicantInsuranceEobSchema(false),
        },
        secondaryScheduleOfBenefits: {
          path: 'secondary-insurance-sob',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData) &&
            get('applicantSecondaryHasPrescription', formData) &&
            !get('applicantSecondaryEob', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantSecondaryProvider
              } schedule of benefits`,
            ),
          ...applicantInsuranceSOBSchema(false),
        },
        secondaryCard: {
          path: 'secondary-insurance-card-upload',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            privWrapper(`${fnp(formData)} health insurance card`),
          ...applicantInsuranceCardSchema(false),
        },
        secondaryComments: {
          path: 'secondary-insurance-comments',
          depends: formData =>
            !formData[REV2025_TOGGLE_KEY] &&
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            privWrapper(
              `${fnp(formData)} ${
                formData.applicantSecondaryProvider
              } additional comments`,
            ),
          ...applicantInsuranceCommentsSchema(false),
        },
      },
    },
  },
};

export default formConfig;
