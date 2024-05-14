import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import get from 'platform/utilities/data/get';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from './submitTransformer';
import { getAgeInYears } from '../../shared/utilities';
import { nameWording } from '../helpers/utilities';
import FileFieldWrapped from '../components/FileUploadWrapper';
import { prefillTransformer } from './prefillTransformer';

import {
  certifierRole,
  certifierAddress,
  certifierPhoneEmail,
  certifierRelationship,
  certifierNameSchema,
} from '../chapters/certifierInformation';

import {
  applicantNameDobSchema,
  applicantSsnSchema,
  applicantAddressInfoSchema,
  applicantContactInfoSchema,
  blankSchema,
} from '../chapters/applicantInformation';

import {
  applicantHasMedicareABSchema,
  applicantMedicareABContextSchema,
  applicantMedicarePartACarrierSchema,
  applicantMedicarePartBCarrierSchema,
  applicantMedicarePharmacySchema,
  applicantMedicareAdvantageSchema,
  applicantHasMedicareDSchema,
  applicantMedicarePartDCarrierSchema,
  appMedicareOver65IneligibleUploadSchema,
  applicantMedicareABUploadSchema,
  applicantMedicareDUploadSchema,
} from '../chapters/medicareInformation';
import {
  applicantHasInsuranceSchema,
  applicantProviderSchema,
  applicantInsuranceEOBSchema,
  applicantInsuranceThroughEmployerSchema,
  applicantInsurancePrescriptionSchema,
  applicantInsuranceTypeSchema,
  applicantMedigapSchema,
  applicantInsuranceCommentsSchema,
  applicantInsuranceCardSchema,
} from '../chapters/healthInsuranceInformation';

// import mockdata from '../tests/fixtures/data/test-data.json';
import { hasReq } from '../../shared/components/fileUploads/MissingFileOverview';
import SupportingDocumentsPage from '../components/SupportingDocumentsPage';
import { MissingFileConsentPage } from '../components/MissingFileConsentPage';

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
  formId: '10-7959C',
  dev: {
    showNavLinks: false,
    collapsibleNavLinks: true,
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: formData =>
        formData.certifierRole === 'applicant'
          ? 'applicantName'
          : 'certifierName',
    },
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
  title: '10-7959C CHAMPVA Other Health Insurance Certification form',
  defaultDefinitions: {},
  chapters: {
    certifierInformation: {
      title: 'Signer information',
      pages: {
        role: {
          path: 'your-information/description',
          title: 'Which of these best describes you?',
          // initialData: mockdata.data,
          uiSchema: certifierRole.uiSchema,
          schema: certifierRole.schema,
        },
        name: {
          path: 'your-information/name',
          title: 'Your name',
          depends: formData => get('certifierRole', formData) !== 'applicant',
          ...certifierNameSchema,
        },
        address: {
          path: 'your-information/address',
          title: 'Your mailing address',
          depends: formData => get('certifierRole', formData) !== 'applicant',
          ...certifierAddress,
        },
        phoneEmail: {
          path: 'your-information/phone-email',
          title: 'Your phone number',
          depends: formData => get('certifierRole', formData) !== 'applicant',
          ...certifierPhoneEmail,
        },
        relationship: {
          path: 'your-information/relationship',
          title: 'Your relationship to the applicant',
          depends: formData => get('certifierRole', formData) !== 'applicant',
          ...certifierRelationship,
        },
      },
    },
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantNameDob: {
          path: 'applicant-information',
          title: formData =>
            `${
              formData.certifierRole === 'applicant' ? 'Your' : 'Applicant'
            } name and date of birth`,
          ...applicantNameDobSchema,
        },
        applicantIdentity: {
          path: 'applicant-information/ssn',
          title: formData =>
            `${nameWording(formData)} identification information`,
          ...applicantSsnSchema,
        },
        applicantAddressInfo: {
          path: 'applicant-information/address',
          title: formData => `${nameWording(formData)} mailing address`,
          ...applicantAddressInfoSchema,
        },

        //
        // TODO: add prefill address page if user authenticated
        //

        // TODO: have conditional logic to check if third party and app
        // is under age 18 (contact page)
        applicantContactInfo: {
          path: 'applicant-information/contact',
          title: formData => `${nameWording(formData)} contact information`,
          ...applicantContactInfoSchema,
        },
      },
    },
    medicareInformation: {
      title: 'Medicare information',
      pages: {
        hasMedicareAB: {
          path: 'medicare-ab',
          title: formData => `${nameWording(formData)} Medicare status`,
          ...applicantHasMedicareABSchema,
        },
        // If 'no' to previous question:
        medicareABContext: {
          path: 'no-medicare-ab',
          title: formData => `${nameWording(formData)} Medicare status`,
          depends: formData =>
            get('applicantMedicareStatus', formData) === false,
          ...applicantMedicareABContextSchema,
        },
        // If 'yes' to previous question:
        partACarrier: {
          path: 'carrier-a',
          title: formData => `${nameWording(formData)} Medicare Part A carrier`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantMedicarePartACarrierSchema,
        },
        // If ineligible and over 65, require user to upload proof of ineligibility
        medicareIneligible: {
          path: 'ineligible',
          title: 'Over 65 and ineligible for Medicare',
          depends: formData => {
            return (
              get('applicantMedicareStatusContinued', formData) ===
                'ineligible' && getAgeInYears(formData?.applicantDOB) >= 65
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...appMedicareOver65IneligibleUploadSchema,
        },
        partBCarrier: {
          path: 'carrier-b',
          title: formData => `${nameWording(formData)} Medicare Part B carrier`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantMedicarePartBCarrierSchema,
        },
        pharmacyBenefits: {
          path: 'pharmacy',
          title: formData =>
            `${nameWording(formData)} Medicare pharmacy benefits`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantMedicarePharmacySchema,
        },
        advantagePlan: {
          path: 'advantage',
          title: formData => `${nameWording(formData)} Medicare coverage`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantMedicareAdvantageSchema,
        },
        medicareABCards: {
          path: 'ab-upload',
          title: formData => `${nameWording(formData)} Medicare card (A/B)`,
          depends: formData => get('applicantMedicareStatus', formData),
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...applicantMedicareABUploadSchema,
        },
        hasMedicareD: {
          path: 'medicare-d',
          title: formData => `${nameWording(formData)} Medicare status`,
          depends: formData => get('applicantMedicareStatus', formData),
          ...applicantHasMedicareDSchema,
        },
        partDCarrier: {
          path: 'carrier-d',
          title: formData => `${nameWording(formData)} Medicare Part D carrier`,
          depends: formData =>
            get('applicantMedicareStatus', formData) &&
            get('applicantMedicareStatusD', formData),
          ...applicantMedicarePartDCarrierSchema,
        },
        medicareDCards: {
          path: 'd-upload',
          title: formData => `${nameWording(formData)} Medicare card (D)`,
          depends: formData =>
            get('applicantMedicareStatus', formData) &&
            get('applicantMedicareStatusD', formData),
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          ...applicantMedicareDUploadSchema,
        },
      },
    },
    healthcareInformation: {
      title: 'Healthcare information',
      pages: {
        hasPrimaryHealthInsurance: {
          path: 'has-primary',
          title: formData =>
            `${nameWording(formData)} primary health insurance`,
          ...applicantHasInsuranceSchema(true),
        },
        primaryProvider: {
          path: 'primary-provider',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${nameWording(formData)} health insurance information`,
          ...applicantProviderSchema(true),
        },
        primaryThroughEmployer: {
          path: 'primary-through-employer',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantPrimaryProvider
            } type of insurance`,
          ...applicantInsuranceThroughEmployerSchema(true),
        },
        primaryPrescription: {
          path: 'primary-prescription',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantPrimaryProvider
            } prescription coverage`,
          ...applicantInsurancePrescriptionSchema(true),
        },
        primaryEOB: {
          path: 'primary-eob',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantPrimaryProvider
            } explanation of benefits`,
          ...applicantInsuranceEOBSchema(true),
        },
        primaryType: {
          path: 'primary-insurance-type',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantPrimaryProvider
            } insurance plan`,
          ...applicantInsuranceTypeSchema(true),
        },
        primaryMedigap: {
          path: 'primary-medigap',
          depends: formData =>
            get('applicantHasPrimary', formData) &&
            get('applicantPrimaryInsuranceType.medigap', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantPrimaryProvider
            } Medigap information`,
          ...applicantMedigapSchema(true),
        },
        primaryComments: {
          path: 'primary-comments',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantPrimaryProvider
            } additional comments`,
          ...applicantInsuranceCommentsSchema(true),
        },
        primaryCard: {
          path: 'primary-card-upload',
          depends: formData => get('applicantHasPrimary', formData),
          title: formData =>
            `${nameWording(formData)} primary health insurance card`,
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...applicantInsuranceCardSchema(true),
        },
        hasSecondaryHealthInsurance: {
          path: 'has-secondary',
          title: formData =>
            `${nameWording(formData)} secondary health insurance`,
          ...applicantHasInsuranceSchema(false),
        },
        secondaryProvider: {
          path: 'secondary-provider',
          depends: formData => get('applicantHasSecondary', formData),
          title: formData =>
            `${nameWording(formData)} secondary health insurance information`,
          ...applicantProviderSchema(false),
        },
        secondaryThroughEmployer: {
          path: 'secondary-through-employer',
          depends: formData => get('applicantHasSecondary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantSecondaryProvider
            } secondary type of insurance`,
          ...applicantInsuranceThroughEmployerSchema(false),
        },
        secondaryPrescription: {
          path: 'secondary-prescription',
          depends: formData => get('applicantHasSecondary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantSecondaryProvider
            } secondary prescription coverage`,
          ...applicantInsurancePrescriptionSchema(false),
        },
        secondaryEOB: {
          path: 'secondary-eob',
          depends: formData => get('applicantHasSecondary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantSecondaryProvider
            } explanation of benefits`,
          ...applicantInsuranceEOBSchema(false),
        },
        secondaryType: {
          path: 'secondary-insurance-type',
          depends: formData => get('applicantHasSecondary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantSecondaryProvider
            } insurance plan`,
          ...applicantInsuranceTypeSchema(false),
        },
        secondaryMedigap: {
          path: 'secondary-medigap',
          depends: formData =>
            get('applicantHasSecondary', formData) &&
            get('applicantSecondaryInsuranceType.medigap', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantSecondaryProvider
            } Medigap information`,
          ...applicantMedigapSchema(false),
        },
        secondaryComments: {
          path: 'secondary-comments',
          depends: formData => get('applicantHasSecondary', formData),
          title: formData =>
            `${nameWording(formData)} ${
              formData.applicantSecondaryProvider
            } additional comments`,
          ...applicantInsuranceCommentsSchema(false),
        },
        secondaryCard: {
          path: 'secondary-card-upload',
          depends: formData => get('applicantHasSecondary', formData),
          title: formData =>
            `${nameWording(formData)} secondary health insurance card`,
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          ...applicantInsuranceCardSchema(false),
        },
      },
    },
    fileUpload: {
      title: 'File Upload',
      pages: {
        supportingFilesReview: {
          path: 'supporting-files',
          title: 'Upload your supporting files',
          CustomPage: SupportingDocumentsPage,
          CustomPageReview: null,
          uiSchema: {
            'ui:options': {
              keepInPageOnReview: false,
            },
          },
          schema: blankSchema,
        },
        missingFileConsent: {
          path: 'consent-mail',
          title: 'Upload your supporting files',
          depends: formData => {
            try {
              return (
                hasReq(formData.applicants, true) ||
                hasReq(formData.applicants, false) ||
                hasReq(formData, true) ||
                hasReq(formData, false)
              );
            } catch {
              return false;
            }
          },
          CustomPage: MissingFileConsentPage,
          CustomPageReview: null,
          uiSchema: {
            'ui:options': {
              keepInPageOnReview: false,
            },
          },
          schema: blankSchema,
        },
      },
    },
  },
};

export default formConfig;
