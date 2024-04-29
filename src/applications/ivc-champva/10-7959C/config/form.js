import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import get from 'platform/utilities/data/get';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from './submitTransformer';
import { applicantWording, getAgeInYears } from '../../shared/utilities';
import { nameWording } from '../helpers/utilities';
import FileFieldWrapped from '../components/FileUploadWrapper';

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
  ApplicantHasPrimaryPage,
  ApplicantHasPrimaryReviewPage,
  ApplicantHasSecondaryPage,
  ApplicantHasSecondaryReviewPage,
} from '../components/ApplicantHasPrimaryPage';
import {
  applicantHasInsuranceSchema,
  applicantProviderSchema,
  applicantInsuranceEffectiveDateSchema,
  applicantInsuranceExpirationDateSchema,
  applicantInsuranceEOBSchema,
  applicantInsuranceThroughEmployerSchema,
  applicantInsurancePrescriptionSchema,
  applicantInsuranceTypeSchema,
  applicantMedigapSchema,
  applicantInsuranceCommentsSchema,
  applicantInsuranceCardSchema,
} from '../chapters/healthInsuranceInformation';

import { hasPrimaryProvider, hasSecondaryProvider } from './conditionalPaths';
import {
  ApplicantPrimaryThroughEmployerPage,
  ApplicantPrimaryThroughEmployerReviewPage,
  ApplicantSecondaryThroughEmployerPage,
  ApplicantSecondaryThroughEmployerReviewPage,
} from '../components/ApplicantPrimaryThroughEmployer';
import {
  ApplicantPrimaryEOBPage,
  ApplicantPrimaryEOBReviewPage,
  ApplicantSecondaryEOBPage,
  ApplicantSecondaryEOBReviewPage,
} from '../components/ApplicantPrimaryEOBPage';
import {
  ApplicantPrimaryPrescriptionPage,
  ApplicantPrimaryPrescriptionReviewPage,
  ApplicantSecondaryPrescriptionPage,
  ApplicantSecondaryPrescriptionReviewPage,
} from '../components/ApplicantPrimaryPrescriptionPage';
import {
  ApplicantInsuranceTypePage,
  ApplicantInsuranceTypeReviewPage,
  ApplicantSecondaryInsuranceTypePage,
  ApplicantSecondaryInsuranceTypeReviewPage,
} from '../components/ApplicantInsurancePlanTypePage';

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
  formId: '10-7959C',
  transformForSubmit,
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
          ? 'applicants[0].applicantName'
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
          uiSchema: certifierAddress.uiSchema,
          schema: certifierAddress.schema,
        },
        phoneEmail: {
          path: 'your-information/phone-email',
          title: 'Your phone number',
          depends: formData => get('certifierRole', formData) !== 'applicant',
          uiSchema: certifierPhoneEmail.uiSchema,
          schema: certifierPhoneEmail.schema,
        },
        relationship: {
          path: 'your-information/relationship',
          title: 'Your relationship to the applicant',
          depends: formData => get('certifierRole', formData) !== 'applicant',
          uiSchema: certifierRelationship.uiSchema,
          schema: certifierRelationship.schema,
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
          uiSchema: applicantNameDobSchema.uiSchema,
          schema: applicantNameDobSchema.schema,
        },
        applicantIdentity: {
          path: 'applicant-information/ssn',
          title: formData =>
            `${nameWording(formData)} identification information`,
          uiSchema: applicantSsnSchema.uiSchema,
          schema: applicantSsnSchema.schema,
        },
        applicantAddressInfo: {
          path: 'applicant-information/address',
          title: formData => `${nameWording(formData)} mailing address`,
          uiSchema: applicantAddressInfoSchema.uiSchema,
          schema: applicantAddressInfoSchema.schema,
        },

        //
        // TODO: add prefill address page if user authenticated
        //

        // TODO: have conditional logic to check if third party and app
        // is under age 18 (contact page)
        applicantContactInfo: {
          path: 'applicant-information/contact',
          title: formData => `${nameWording(formData)} contact information`,
          uiSchema: applicantContactInfoSchema.uiSchema,
          schema: applicantContactInfoSchema.schema,
        },
      },
    },
    medicareInformation: {
      title: 'Medicare information',
      pages: {
        hasMedicareAB: {
          path: 'medicare-ab',
          title: formData => `${nameWording(formData)} Medicare status`,
          uiSchema: applicantHasMedicareABSchema.uiSchema,
          schema: applicantHasMedicareABSchema.schema,
        },
        // If 'no' to previous question:
        medicareABContext: {
          path: 'no-medicare-ab',
          title: formData => `${nameWording(formData)} Medicare status`,
          depends: formData =>
            get('applicantMedicareStatus', formData) === false,
          uiSchema: applicantMedicareABContextSchema.uiSchema,
          schema: applicantMedicareABContextSchema.schema,
        },
        // If 'yes' to previous question:
        partACarrier: {
          path: 'carrier-a',
          title: formData => `${nameWording(formData)} Medicare Part A carrier`,
          depends: formData => get('applicantMedicareStatus', formData),
          uiSchema: applicantMedicarePartACarrierSchema.uiSchema,
          schema: applicantMedicarePartACarrierSchema.schema,
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
          uiSchema: applicantMedicarePartBCarrierSchema.uiSchema,
          schema: applicantMedicarePartBCarrierSchema.schema,
        },
        pharmacyBenefits: {
          path: 'pharmacy',
          title: formData =>
            `${nameWording(formData)} Medicare pharmacy benefits`,
          depends: formData => get('applicantMedicareStatus', formData),
          uiSchema: applicantMedicarePharmacySchema.uiSchema,
          schema: applicantMedicarePharmacySchema.schema,
        },
        advantagePlan: {
          path: 'advantage',
          title: formData => `${nameWording(formData)} Medicare coverage`,
          depends: formData => get('applicantMedicareStatus', formData),
          uiSchema: applicantMedicareAdvantageSchema.uiSchema,
          schema: applicantMedicareAdvantageSchema.schema,
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
          uiSchema: applicantHasMedicareDSchema.uiSchema,
          schema: applicantHasMedicareDSchema.schema,
        },
        partDCarrier: {
          path: 'carrier-d',
          title: formData => `${nameWording(formData)} Medicare Part D carrier`,
          depends: formData =>
            get('applicantMedicareStatus', formData) &&
            get('applicantMedicareStatusD', formData),
          uiSchema: applicantMedicarePartDCarrierSchema.uiSchema,
          schema: applicantMedicarePartDCarrierSchema.schema,
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
          path: ':index/has-primary',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} primary health insurance`,
          CustomPage: ApplicantHasPrimaryPage,
          CustomPageReview: ApplicantHasPrimaryReviewPage,
          ...applicantHasInsuranceSchema(true),
        },
        primaryProvider: {
          path: ':index/primary-provider',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} health insurance provider’s name`,
          ...applicantProviderSchema(true),
        },
        primaryEffective: {
          path: ':index/primary-effective-date',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantPrimaryProvider
            } insurance effective date`,
          ...applicantInsuranceEffectiveDateSchema(true),
        },
        primaryExpiration: {
          path: ':index/primary-expiration-date',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantPrimaryProvider
            } insurance expiration date`,
          ...applicantInsuranceExpirationDateSchema(true),
        },
        primaryThroughEmployer: {
          path: ':index/primary-through-employer',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantPrimaryProvider
            } type of insurance`,
          CustomPage: ApplicantPrimaryThroughEmployerPage,
          CustomPageReview: ApplicantPrimaryThroughEmployerReviewPage,
          ...applicantInsuranceThroughEmployerSchema(true),
        },
        primaryPrescription: {
          path: ':index/primary-prescription',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantPrimaryProvider
            } prescription coverage`,
          CustomPage: ApplicantPrimaryPrescriptionPage,
          CustomPageReview: ApplicantPrimaryPrescriptionReviewPage,
          ...applicantInsurancePrescriptionSchema(true),
        },
        primaryEOB: {
          path: ':index/primary-eob',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantPrimaryProvider
            } explanation of benefits`,
          CustomPage: ApplicantPrimaryEOBPage,
          CustomPageReview: ApplicantPrimaryEOBReviewPage,
          ...applicantInsuranceEOBSchema(true),
        },
        primaryType: {
          path: ':index/primary-insurance-type',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantPrimaryProvider
            } insurance plan`,
          CustomPage: ApplicantInsuranceTypePage,
          CustomPageReview: ApplicantInsuranceTypeReviewPage,
          ...applicantInsuranceTypeSchema(true),
        },
        primaryMedigap: {
          path: ':index/primary-medigap',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              hasPrimaryProvider(formData, index) &&
              get(
                'applicantPrimaryInsuranceType',
                formData?.applicants?.[index],
              )?.includes('medigap')
            );
          },
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantPrimaryProvider
            } Medigap information`,
          ...applicantMedigapSchema(true),
        },
        primaryComments: {
          path: ':index/primary-comments',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantPrimaryProvider
            } additional comments`,
          ...applicantInsuranceCommentsSchema(true),
        },
        primaryCard: {
          path: ':index/primary-card-upload',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} primary health insurance card`,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          ...applicantInsuranceCardSchema(true),
        },
        hasSecondaryHealthInsurance: {
          path: ':index/has-secondary',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} secondary health insurance`,
          CustomPage: ApplicantHasSecondaryPage,
          CustomPageReview: ApplicantHasSecondaryReviewPage,
          ...applicantHasInsuranceSchema(false),
        },
        secondaryProvider: {
          path: ':index/secondary-provider',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          title: item =>
            `${applicantWording(
              item,
            )} secondary health insurance provider’s name`,
          ...applicantProviderSchema(false),
        },
        secondaryEffective: {
          path: ':index/secondary-effective-date',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantSecondaryProvider
            } insurance effective date`,
          ...applicantInsuranceEffectiveDateSchema(false),
        },
        secondaryExpiration: {
          path: ':index/secondary-expiration-date',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantSecondaryProvider
            } secondary insurance expiration date`,
          ...applicantInsuranceExpirationDateSchema(false),
        },
        secondaryThroughEmployer: {
          path: ':index/secondary-through-employer',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantSecondaryProvider
            } type of secondary insurance`,
          CustomPage: ApplicantSecondaryThroughEmployerPage,
          CustomPageReview: ApplicantSecondaryThroughEmployerReviewPage,
          ...applicantInsuranceThroughEmployerSchema(false),
        },
        secondaryPrescription: {
          path: ':index/secondary-prescription',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantSecondaryProvider
            } secondary prescription coverage`,
          CustomPage: ApplicantSecondaryPrescriptionPage,
          CustomPageReview: ApplicantSecondaryPrescriptionReviewPage,
          ...applicantInsurancePrescriptionSchema(false),
        },
        secondaryEOB: {
          path: ':index/secondary-eob',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantSecondaryProvider
            } explanation of benefits for secondary insurance`,
          CustomPage: ApplicantSecondaryEOBPage,
          CustomPageReview: ApplicantSecondaryEOBReviewPage,
          ...applicantInsuranceEOBSchema(false),
        },
        secondaryType: {
          path: ':index/secondary-insurance-type',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantSecondaryProvider
            } secondary insurance plan type`,
          CustomPage: ApplicantSecondaryInsuranceTypePage,
          CustomPageReview: ApplicantSecondaryInsuranceTypeReviewPage,
          ...applicantInsuranceTypeSchema(false),
        },
        secondaryMedigap: {
          path: ':index/secondary-medigap',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              hasSecondaryProvider(formData, index) &&
              get(
                'applicantSecondaryInsuranceType',
                formData?.applicants?.[index],
              )?.includes('medigap')
            );
          },
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantSecondaryProvider
            } secondary insurance Medigap information`,
          ...applicantMedigapSchema(false),
        },
        secondaryComments: {
          path: ':index/secondary-comments',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} ${
              item?.applicantSecondaryProvider
            } additional comments`,
          ...applicantInsuranceCommentsSchema(false),
        },
        secondaryCard: {
          path: ':index/secondary-card-upload',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} secondary health insurance card`,
          depends: (formData, index) => hasSecondaryProvider(formData, index),
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
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
