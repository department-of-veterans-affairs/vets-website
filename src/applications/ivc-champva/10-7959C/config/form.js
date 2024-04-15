import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import get from 'platform/utilities/data/get';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { applicantWording } from '../../shared/utilities';

import {
  certifierRole,
  certifierAddress,
  certifierPhoneEmail,
  certifierRelationship,
} from '../chapters/certifierInformation';

import {
  applicantNameDobSchema,
  applicantStartSchema,
  applicantSsnSchema,
  applicantPreAddressSchema,
  applicantAddressInfoSchema,
  applicantContactInfoSchema,
} from '../chapters/applicantInformation';

import {
  applicantHasMedicareABSchema,
  applicantMedicareABContextSchema,
  applicantMedicarePartACarrierSchema,
  applicantMedicarePartAEffectiveDateSchema,
  applicantMedicarePartBCarrierSchema,
  applicantMedicarePartBEffectiveDateSchema,
  applicantMedicarePharmacySchema,
  applicantMedicareAdvantageSchema,
  applicantHasMedicareDSchema,
  applicantMedicarePartDCarrierSchema,
  applicantMedicarePartDEffectiveDateSchema,
} from '../chapters/medicareInformation';
import {
  ApplicantMedicareStatusPage,
  ApplicantMedicareStatusReviewPage,
} from '../components/ApplicantMedicareStatusPage';
import {
  ApplicantMedicareStatusContinuedPage,
  ApplicantMedicareStatusContinuedReviewPage,
} from '../components/ApplicantMedicareStatusContinuedPage';
import {
  ApplicantMedicarePharmacyPage,
  ApplicantMedicarePharmacyReviewPage,
} from '../components/ApplicantMedicarePharmacyPage';
import {
  ApplicantMedicareAdvantagePage,
  ApplicantMedicareAdvantageReviewPage,
} from '../components/ApplicantMedicareAdvantagePage';
import {
  ApplicantMedicareStatusDPage,
  ApplicantMedicareStatusDReviewPage,
} from '../components/ApplicantMedicareStatusDPage';
import {
  ApplicantHasPrimaryPage,
  ApplicantHasPrimaryReviewPage,
  ApplicantHasSecondaryPage,
  ApplicantHasSecondaryReviewPage,
} from '../components/ApplicantHasPrimaryPage';
import {
  applicantHasPrimarySchema,
  applicantProviderSchema,
  applicantPrimaryEffectiveDateSchema,
  applicantPrimaryExpirationDateSchema,
  applicantPrimaryEOBSchema,
  applicantPrimaryPrescriptionSchema,
  applicantPrimaryTypeSchema,
  applicantPrimaryMedigapSchema,
  applicantPrimaryCommentsSchema,
  applicantHasSecondarySchema,
} from '../chapters/healthInsuranceInformation';

import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';
import {
  hasMedicareAB,
  hasMedicareD,
  noMedicareAB,
  hasPrimaryProvider,
  hasSecondaryProvider,
} from './conditionalPaths';
import mockdata from '../tests/fixtures/data/test-data.json';
import {
  ApplicantPrimaryThroughEmployerPage,
  ApplicantPrimaryThroughEmployerReviewPage,
} from '../components/ApplicantPrimaryThroughEmployer';
import {
  ApplicantPrimaryEOBPage,
  ApplicantPrimaryEOBReviewPage,
} from '../components/ApplicantPrimaryEOBPage';
import {
  ApplicantPrimaryPrescriptionPage,
  ApplicantPrimaryPrescriptionReviewPage,
} from '../components/ApplicantPrimaryPrescriptionPage';
import {
  ApplicantInsuranceTypePage,
  ApplicantInsuranceTypeReviewPage,
} from '../components/ApplicantInsurancePlanTypePage';

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
          initialData: mockdata.data,
          uiSchema: certifierRole.uiSchema,
          schema: certifierRole.schema,
        },
        address: {
          path: 'your-information/address',
          title: 'Your mailing address',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: certifierAddress.uiSchema,
          schema: certifierAddress.schema,
        },
        phoneEmail: {
          path: 'your-information/phone-email',
          title: 'Your phone number',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: certifierPhoneEmail.uiSchema,
          schema: certifierPhoneEmail.schema,
        },
        relationship: {
          path: 'your-information/relationship',
          title: 'Your relationship to the applicant',
          depends: formData => get('certifierRole', formData) === 'other',
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
          title: 'Applicant name and date of birth',
          arrayPath: 'applicants',
          uiSchema: applicantNameDobSchema.uiSchema,
          schema: applicantNameDobSchema.schema,
        },
        applicantStart: {
          path: 'applicant-information/:index/start',
          arrayPath: 'applicants',
          title: item => `${applicantWording(item)} information`,
          showPagePerItem: true,
          depends: () => !window.location.href.includes('review-and-submit'),
          uiSchema: applicantStartSchema.uiSchema,
          schema: applicantStartSchema.schema,
        },
        applicantIdentity: {
          path: 'applicant-information/:index/ssn',
          arrayPath: 'applicants',
          title: item => `${applicantWording(item)} identification information`,
          showPagePerItem: true,
          uiSchema: applicantSsnSchema.uiSchema,
          schema: applicantSsnSchema.schema,
        },
        applicantAddressScreener: {
          path: 'applicant-information/:index/pre-address',
          arrayPath: 'applicants',
          showPagePerItem: true,
          keepInPageOnReview: false,
          depends: (formData, index) => index > 0,
          title: item => `${applicantWording(item)} mailing address`,
          CustomPage: ApplicantAddressCopyPage,
          CustomPageReview: null,
          uiSchema: applicantPreAddressSchema.uiSchema,
          schema: applicantPreAddressSchema.schema,
        },
        applicantAddressInfo: {
          path: 'applicant-information/:index/address',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} mailing address`,
          uiSchema: applicantAddressInfoSchema.uiSchema,
          schema: applicantAddressInfoSchema.schema,
        },
        applicantContactInfo: {
          path: 'applicant-information/:index/contact',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} contact information`,
          uiSchema: applicantContactInfoSchema.uiSchema,
          schema: applicantContactInfoSchema.schema,
        },
      },
    },
    medicareInformation: {
      title: 'Medicare information',
      pages: {
        hasMedicareAB: {
          path: ':index/medicare-ab',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare status`,
          CustomPage: ApplicantMedicareStatusPage,
          CustomPageReview: ApplicantMedicareStatusReviewPage,
          uiSchema: applicantHasMedicareABSchema.uiSchema,
          schema: applicantHasMedicareABSchema.schema,
        },
        // If 'no' to previous question:
        medicareABContext: {
          path: ':index/no-medicare-ab',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare status`,
          depends: (formData, index) => noMedicareAB(formData, index),
          CustomPage: ApplicantMedicareStatusContinuedPage,
          CustomPageReview: ApplicantMedicareStatusContinuedReviewPage,
          uiSchema: applicantMedicareABContextSchema.uiSchema,
          schema: applicantMedicareABContextSchema.schema,
        },
        // If 'yes' to previous question:
        partACarrier: {
          path: ':index/carrier-a',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare Part A carrier`,
          depends: (formData, index) => hasMedicareAB(formData, index),
          uiSchema: applicantMedicarePartACarrierSchema.uiSchema,
          schema: applicantMedicarePartACarrierSchema.schema,
        },
        partAEffective: {
          path: ':index/effective-a',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} coverage information`,
          depends: (formData, index) => hasMedicareAB(formData, index),
          uiSchema: applicantMedicarePartAEffectiveDateSchema.uiSchema,
          schema: applicantMedicarePartAEffectiveDateSchema.schema,
        },
        partBCarrier: {
          path: ':index/carrier-b',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare Part B carrier`,
          depends: (formData, index) => hasMedicareAB(formData, index),
          uiSchema: applicantMedicarePartBCarrierSchema.uiSchema,
          schema: applicantMedicarePartBCarrierSchema.schema,
        },
        partBEffective: {
          path: ':index/effective-b',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} coverage information`,
          depends: (formData, index) => hasMedicareAB(formData, index),
          uiSchema: applicantMedicarePartBEffectiveDateSchema.uiSchema,
          schema: applicantMedicarePartBEffectiveDateSchema.schema,
        },
        pharmacyBenefits: {
          path: ':index/pharmacy',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare pharmacy benefits`,
          depends: (formData, index) => hasMedicareAB(formData, index),
          CustomPage: ApplicantMedicarePharmacyPage,
          CustomPageReview: ApplicantMedicarePharmacyReviewPage,
          uiSchema: applicantMedicarePharmacySchema.uiSchema,
          schema: applicantMedicarePharmacySchema.schema,
        },
        advantagePlan: {
          path: ':index/advantage',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare coverage`,
          depends: (formData, index) => hasMedicareAB(formData, index),
          CustomPage: ApplicantMedicareAdvantagePage,
          CustomPageReview: ApplicantMedicareAdvantageReviewPage,
          uiSchema: applicantMedicareAdvantageSchema.uiSchema,
          schema: applicantMedicareAdvantageSchema.schema,
        },
        hasMedicareD: {
          path: ':index/medicare-d',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare status`,
          depends: (formData, index) => hasMedicareAB(formData, index),
          CustomPage: ApplicantMedicareStatusDPage,
          CustomPageReview: ApplicantMedicareStatusDReviewPage,
          uiSchema: applicantHasMedicareDSchema.uiSchema,
          schema: applicantHasMedicareDSchema.schema,
        },
        partDCarrier: {
          path: ':index/carrier-d',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare Part D carrier`,
          depends: (formData, index) =>
            hasMedicareAB(formData, index) && hasMedicareD(formData, index),
          uiSchema: applicantMedicarePartDCarrierSchema.uiSchema,
          schema: applicantMedicarePartDCarrierSchema.schema,
        },
        partDEffective: {
          path: ':index/effective-d',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} coverage information`,
          depends: (formData, index) =>
            hasMedicareAB(formData, index) && hasMedicareD(formData, index),
          uiSchema: applicantMedicarePartDEffectiveDateSchema.uiSchema,
          schema: applicantMedicarePartDEffectiveDateSchema.schema,
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
          uiSchema: applicantHasPrimarySchema.uiSchema,
          schema: applicantHasPrimarySchema.schema,
        },
        primaryProvider: {
          path: ':index/primary-provider',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => hasPrimaryProvider(formData, index),
          title: item =>
            `${applicantWording(item)} health insurance provider’s name`,
          uiSchema: applicantProviderSchema(true).uiSchema,
          schema: applicantProviderSchema(true).schema,
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
          uiSchema: applicantPrimaryEffectiveDateSchema.uiSchema,
          schema: applicantPrimaryEffectiveDateSchema.schema,
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
          uiSchema: applicantPrimaryExpirationDateSchema.uiSchema,
          schema: applicantPrimaryExpirationDateSchema.schema,
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
          uiSchema: applicantHasPrimarySchema.uiSchema,
          schema: applicantHasPrimarySchema.schema,
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
          uiSchema: applicantPrimaryPrescriptionSchema.uiSchema,
          schema: applicantPrimaryPrescriptionSchema.schema,
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
          uiSchema: applicantPrimaryEOBSchema.uiSchema,
          schema: applicantPrimaryEOBSchema.schema,
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
          uiSchema: applicantPrimaryTypeSchema.uiSchema,
          schema: applicantPrimaryTypeSchema.schema,
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
          uiSchema: applicantPrimaryMedigapSchema.uiSchema,
          schema: applicantPrimaryMedigapSchema.schema,
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
          uiSchema: applicantPrimaryCommentsSchema.uiSchema,
          schema: applicantPrimaryCommentsSchema.schema,
        },
        hasSecondaryHealthInsurance: {
          path: ':index/has-secondary',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} secondary health insurance`,
          CustomPage: ApplicantHasSecondaryPage,
          CustomPageReview: ApplicantHasSecondaryReviewPage,
          uiSchema: applicantHasSecondarySchema.uiSchema,
          schema: applicantHasSecondarySchema.schema,
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
          uiSchema: applicantProviderSchema(false).uiSchema,
          schema: applicantProviderSchema(false).schema,
        },
      },
    },
  },
};

export default formConfig;
