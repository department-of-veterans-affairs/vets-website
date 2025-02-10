import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import get from 'platform/utilities/data/get';
import { defaultItemPageScrollAndFocusTarget as scrollAndFocusTarget } from 'platform/forms-system/src/js/patterns/array-builder';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from './submitTransformer';
import { nameWording } from '../../shared/utilities';
import FileFieldWrapped from '../components/FileUploadWrapper';
import { prefillTransformer } from './prefillTransformer';
import SubmissionError from '../../shared/components/SubmissionError';

import {
  applicantNameDobSchema,
  applicantSsnSchema,
  applicantAddressInfoSchema,
  applicantContactInfoSchema,
  applicantGenderSchema,
  blankSchema,
} from '../chapters/applicantInformation';

import {
  applicantHasMedicareSchema,
  applicantMedicareClassSchema,
  applicantMedicarePartACarrierSchema,
  applicantMedicarePartBCarrierSchema,
  applicantMedicarePharmacySchema,
  applicantHasMedicareDSchema,
  applicantMedicarePartDCarrierSchema,
  applicantMedicareABUploadSchema,
  applicantMedicareDUploadSchema,
} from '../chapters/medicareInformation';
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

import {
  formSignatureSchema,
  applicationEmailSchema,
} from '../chapters/formSignature';
import CustomAttestation from '../components/CustomAttestation';

import GetFormHelp from '../../shared/components/GetFormHelp';
import { hasReq } from '../../shared/components/fileUploads/MissingFileOverview';
import SupportingDocumentsPage from '../components/SupportingDocumentsPage';
import { MissingFileConsentPage } from '../components/MissingFileConsentPage';

// import mockdata from '../tests/e2e/fixtures/data/test-data.json';

// Control whether we show the file overview page by calling `hasReq` to
// determine if any files have not been uploaded. Defaults to false (hide the page)
// if anything goes sideways.
function showFileOverviewPage(formData) {
  try {
    return hasReq(formData, true, true) || hasReq(formData, false, true);
  } catch {
    return false;
  }
}

// (First Name Posessive);
function fnp(formData) {
  return nameWording(formData, undefined, undefined, true);
}

/** @type {PageSchema} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-7959C-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  showReviewErrors: !environment.isProduction(),
  footerContent: GetFormHelp,
  submissionError: SubmissionError,
  formId: '10-7959C',
  dev: {
    showNavLinks: false,
    collapsibleNavLinks: true,
  },
  downtime: {
    dependencies: [externalServices.pega],
  },
  preSubmitInfo: {
    required: true,
    CustomComponent: CustomAttestation,
  },
  customText: {
    reviewPageTitle: 'Review form',
    appType: 'form',
  },
  CustomReviewTopContent: () => <h3>Review and sign</h3>,
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
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  transformForSubmit,
  savedFormMessages: {
    notFound:
      'Please start over to apply for CHAMPVA other health insurance certification.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA other health insurance certification.',
  },
  title: 'File for CHAMPVA Other Health Insurance Certification',
  subTitle: 'CHAMPVA Other Health Insurance Certification (VA Form 10-7959c)',
  defaultDefinitions: {},
  chapters: {
    formSignature: {
      title: 'Signer information',
      pages: {
        formSignature: {
          // initialData: mockdata.data,
          path: 'form-signature',
          title: 'Form signature',
          ...formSignatureSchema,
          scrollAndFocusTarget,
        },
        signerEmail: {
          path: 'signer-email',
          title: 'Your email address',
          ...applicationEmailSchema,
          scrollAndFocusTarget,
        },
      },
    },
    applicantInformation: {
      title: 'Beneficiary information',
      pages: {
        applicantNameDob: {
          path: 'applicant-info',
          title: formData =>
            `${
              formData.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
            } name`,
          ...applicantNameDobSchema,
          scrollAndFocusTarget,
        },
        applicantIdentity: {
          path: 'applicant-identification-info',
          title: formData => `${fnp(formData)} identification information`,
          ...applicantSsnSchema,
          scrollAndFocusTarget,
        },
        applicantAddressInfo: {
          path: 'applicant-mailing-address',
          title: formData => `${fnp(formData)} mailing address`,
          ...applicantAddressInfoSchema,
          scrollAndFocusTarget,
        },

        //
        // TODO: add prefill address page if user authenticated
        //

        // TODO: have conditional logic to check if third party and app
        // is under age 18 (contact page)
        applicantContactInfo: {
          path: 'applicant-contact-info',
          title: formData => `${fnp(formData)} contact information`,
          ...applicantContactInfoSchema,
          scrollAndFocusTarget,
        },
        applicantGender: {
          path: 'applicant-gender',
          title: formData => `${fnp(formData)} sex listed at birth`,
          ...applicantGenderSchema,
          scrollAndFocusTarget,
        },
      },
    },
    medicareInformation: {
      title: 'Medicare information',
      pages: {
        hasMedicareAB: {
          path: 'medicare-ab-status',
          title: formData => `${fnp(formData)} Medicare status`,
          ...applicantHasMedicareSchema,
          scrollAndFocusTarget,
        },
        medicareClass: {
          path: 'medicare-plan',
          title: formData => `${fnp(formData)} Medicare coverage`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantMedicareClassSchema,
          scrollAndFocusTarget,
        },
        pharmacyBenefits: {
          path: 'medicare-pharmacy',
          title: formData => `${fnp(formData)} Medicare pharmacy benefits`,
          depends: formData =>
            get('applicantMedicareStatus', formData) &&
            ['advantage', 'other'].includes(
              get('applicantMedicareClass', formData),
            ),
          ...applicantMedicarePharmacySchema,
          scrollAndFocusTarget,
        },
        // If 'yes' to previous question:
        partACarrier: {
          path: 'medicare-a-carrier',
          title: formData => `${fnp(formData)} Medicare Part A carrier`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantMedicarePartACarrierSchema,
          scrollAndFocusTarget,
        },
        partBCarrier: {
          path: 'medicare-b-carrier',
          title: formData => `${fnp(formData)} Medicare Part B carrier`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantMedicarePartBCarrierSchema,
          scrollAndFocusTarget,
        },
        medicareABCards: {
          path: 'medicare-ab-upload',
          title: 'Medicare card for hospital and medical coverage',
          depends: formData => get('applicantMedicareStatus', formData),
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...applicantMedicareABUploadSchema,
          scrollAndFocusTarget,
        },
        hasMedicareD: {
          path: 'medicare-d-status',
          title: formData => `${fnp(formData)} Medicare Part D status`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantHasMedicareDSchema,
          scrollAndFocusTarget,
        },
        partDCarrier: {
          path: 'medicare-d-carrier',
          title: formData => `${fnp(formData)} Medicare Part D carrier`,
          depends: formData =>
            get('applicantMedicareStatus', formData) &&
            get('applicantMedicareStatusD', formData),
          ...applicantMedicarePartDCarrierSchema,
          scrollAndFocusTarget,
        },
        medicareDCards: {
          path: 'medicare-d-upload',
          title: 'Medicare Part D card',
          depends: formData =>
            get('applicantMedicareStatus', formData) &&
            get('applicantMedicareStatusD', formData),
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          ...applicantMedicareDUploadSchema,
          scrollAndFocusTarget,
        },
      },
    },
    healthcareInformation: {
      title: 'Health insurance information',
      pages: {
        hasPrimaryHealthInsurance: {
          path: 'insurance-status',
          title: formData => `${fnp(formData)} health insurance`,
          ...applicantHasInsuranceSchema(true),
          scrollAndFocusTarget,
        },
        primaryType: {
          path: 'insurance-plan',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantPrimaryProvider
            } insurance plan`,
          ...applicantInsuranceTypeSchema(true),
          scrollAndFocusTarget,
        },
        primaryMedigap: {
          path: 'insurance-medigap',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantPrimaryInsuranceType', formData) === 'medigap',
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantPrimaryProvider
            } Medigap information`,
          ...applicantMedigapSchema(true),
          scrollAndFocusTarget,
        },
        primaryProvider: {
          path: 'insurance-info',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData => `${fnp(formData)} health insurance information`,
          ...applicantProviderSchema(true),
          scrollAndFocusTarget,
        },
        primaryThroughEmployer: {
          path: 'insurance-type',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${fnp(formData)} type of insurance for ${
              formData.applicantPrimaryProvider
            }`,
          ...applicantInsuranceThroughEmployerSchema(true),
          scrollAndFocusTarget,
        },
        primaryPrescription: {
          path: 'insurance-prescription',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantPrimaryProvider
            } prescription coverage`,
          ...applicantInsurancePrescriptionSchema(true),
          scrollAndFocusTarget,
        },
        primaryEob: {
          path: 'insurance-eob',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantPrimaryHasPrescription', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantPrimaryProvider
            } explanation of benefits`,
          ...applicantInsuranceEobSchema(true),
          scrollAndFocusTarget,
        },
        primaryScheduleOfBenefits: {
          path: 'insurance-sob',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantPrimaryHasPrescription', formData) &&
            !get('applicantPrimaryEob', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantPrimaryProvider
            } schedule of benefits`,
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...applicantInsuranceSOBSchema(true),
          scrollAndFocusTarget,
        },
        primaryCard: {
          path: 'insurance-upload',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData => `${fnp(formData)} health insurance card`,
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...applicantInsuranceCardSchema(true),
          scrollAndFocusTarget,
        },
        primaryComments: {
          path: 'insurance-comments',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantPrimaryProvider
            } additional comments`,
          ...applicantInsuranceCommentsSchema(true),
          scrollAndFocusTarget,
        },
        hasSecondaryHealthInsurance: {
          path: 'secondary-insurance',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData => `${fnp(formData)} additional health insurance`,
          ...applicantHasInsuranceSchema(false),
          scrollAndFocusTarget,
        },
        secondaryType: {
          path: 'secondary-insurance-plan',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantSecondaryProvider
            } insurance plan`,
          ...applicantInsuranceTypeSchema(false),
          scrollAndFocusTarget,
        },
        secondaryMedigap: {
          path: 'secondary-insurance-medigap',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData) &&
            get('applicantSecondaryInsuranceType', formData) === 'medigap',
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantSecondaryProvider
            } Medigap information`,
          ...applicantMedigapSchema(false),
          scrollAndFocusTarget,
        },
        secondaryProvider: {
          path: 'secondary-insurance-info',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData => `${fnp(formData)} health insurance information`,
          ...applicantProviderSchema(false),
          scrollAndFocusTarget,
        },
        secondaryThroughEmployer: {
          path: 'secondary-insurance-type',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            `${fnp(formData)} type of insurance for ${
              formData.applicantSecondaryProvider
            }`,
          ...applicantInsuranceThroughEmployerSchema(false),
          scrollAndFocusTarget,
        },
        secondaryPrescription: {
          path: 'secondary-insurance-prescription',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantSecondaryProvider
            } prescription coverage`,
          ...applicantInsurancePrescriptionSchema(false),
          scrollAndFocusTarget,
        },
        secondaryEob: {
          path: 'secondary-insurance-eob',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData) &&
            get('applicantSecondaryHasPrescription', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantSecondaryProvider
            } explanation of benefits`,
          ...applicantInsuranceEobSchema(false),
          scrollAndFocusTarget,
        },
        secondaryScheduleOfBenefits: {
          path: 'secondary-insurance-sob',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData) &&
            get('applicantSecondaryHasPrescription', formData) &&
            !get('applicantSecondaryEob', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantSecondaryProvider
            } schedule of benefits`,
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...applicantInsuranceSOBSchema(false),
          scrollAndFocusTarget,
        },
        secondaryCard: {
          path: 'secondary-insurance-card-upload',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData => `${fnp(formData)} health insurance card`,
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...applicantInsuranceCardSchema(false),
          scrollAndFocusTarget,
        },
        secondaryComments: {
          path: 'secondary-insurance-comments',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantHasSecondary', formData),
          title: formData =>
            `${fnp(formData)} ${
              formData.applicantSecondaryProvider
            } additional comments`,
          ...applicantInsuranceCommentsSchema(false),
          scrollAndFocusTarget,
        },
      },
    },
    fileUpload: {
      title: 'File Upload',
      pages: {
        supportingFilesReview: {
          path: 'supporting-files',
          title: 'Upload your supporting files',
          depends: formData => showFileOverviewPage(formData),
          CustomPage: SupportingDocumentsPage,
          CustomPageReview: null,
          uiSchema: {
            'ui:options': {
              keepInPageOnReview: false,
            },
          },
          schema: blankSchema,
          scrollAndFocusTarget,
        },
        missingFileConsent: {
          path: 'consent-mail',
          title: 'Upload your supporting files',
          depends: formData => showFileOverviewPage(formData),
          CustomPage: MissingFileConsentPage,
          CustomPageReview: null,
          uiSchema: {
            'ui:options': {
              keepInPageOnReview: false,
            },
          },
          schema: blankSchema,
          scrollAndFocusTarget,
        },
      },
    },
  },
};

export default formConfig;
