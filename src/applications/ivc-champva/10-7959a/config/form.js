import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import SubmissionError from '../../shared/components/SubmissionError';
import ConfirmationPage from '../containers/ConfirmationPage';
import FormFooter from '../components/FormFooter';
import transformForSubmit from './submitTransformer';
import { FileFieldCustomSimple } from '../../shared/components/fileUploads/FileUpload';
import NotEnrolledPage from '../components/FormPages/NotEnrolledPage';
import AddressSelectionPage from '../components/FormPages/AddressSelectionPage';
import { blankSchema } from '../definitions';
import {
  canSelectAddress,
  hasOhiAndMedicalClaim,
  hasOhiMedicalAndMultiplePolicies,
  isNewClaim,
  isNewMedicalClaim,
  isNewPharmacyClaim,
  isNotEnrolledInChampva,
  isResubmissionClaim,
  isResubmissionEnabled,
  isRoleOther,
  isRoleSponsor,
} from '../utils/helpers';
import {
  certifierRoleSchema,
  certifierBenefitStatusSchema,
  certifierNotEnrolledChampvaSchema,
  certifierNameSchema,
  certifierAddressSchema,
  certifierContactSchema,
  certifierRelationshipSchema,
  certifierClaimStatusSchema,
} from '../chapters/signerInformation';
import {
  insuranceStatusSchema,
  insurancePages,
} from '../chapters/healthInsuranceInformation';
import {
  claimTypeSchema,
  claimWorkSchema,
  claimAutoSchema,
  medicalClaimUploadSchema,
  eobUploadSchema,
  pharmacyClaimUploadSchema,
} from '../chapters/claimInformation';
import {
  applicantNameDobSchema,
  applicantMemberNumberSchema,
  applicantAddressSchema,
  applicantContactSchema,
} from '../chapters/beneficiaryInformation';
import {
  sponsorAddressSchema,
  sponsorNameSchema,
  sponsorContactSchema,
} from '../chapters/sponsorInformation';
import {
  claimIdentificationNumber,
  resubmissionLetterUpload,
  resubmissionDocsUpload,
} from '../chapters/resubmission';

import content from '../locales/en/content.json';

// import mockData from '../tests/e2e/fixtures/data/medical-claim.json';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  transformForSubmit,
  footerContent: FormFooter,
  trackingPrefix: '10-7959a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  submissionError: SubmissionError,
  formId: '10-7959A',
  saveInProgress: {
    messages: {
      inProgress: content['sip-messages--in-progress'],
      expired: content['sip-messages--expired'],
      saved: content['sip-messages--saved'],
    },
  },
  customText: {
    appType: content['form-text--app-type'],
    continueAppButtonText: content['form-text--btn-continue'],
    reviewPageTitle: content['form-text--review-title'],
    startNewAppButtonText: content['form-text--btn-start'],
  },
  downtime: {
    dependencies: [externalServices.pega, externalServices.form107959a],
  },
  preSubmitInfo: {
    statementOfTruth: {
      body: content['statement-of-truth--body-text'],
      fullNamePath: ({ certifierRole } = {}) =>
        ({ other: 'certifierName', sponsor: 'sponsorName' }[certifierRole] ??
        'applicantName'),
    },
  },
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: content['form-messages--not-found'],
    noAuth: content['form-messages--no-auth'],
  },
  title: content['form--title'],
  subTitle: content['form--subtitle'],
  dev: { disableWindowUnloadInCI: true },
  formOptions: {
    useWebComponentForNavigation: true,
    filterInactiveNestedPageData: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      {
        href: '/family-and-caregiver-benefits/',
        label: content['breadcrumb--caregiver-benefits'],
      },
      {
        href: '/family-and-caregiver-benefits/health-and-disability/',
        label: content['breadcrumb--health-benefits'],
      },
      {
        href: '/family-and-caregiver-benefits/health-and-disability/champva/',
        label: content['breadcrumb--champva-benefits'],
      },
      {
        href: '#content',
        label: content['form--title'],
      },
    ],
    homeVeteransAffairs: true,
    wrapping: true,
  }),
  defaultDefinitions: {},
  chapters: {
    signerInformation: {
      title: 'Your information',
      pages: {
        page1: {
          path: 'signer-type',
          title: 'Your information',
          // initialData: mockData.data,
          ...certifierRoleSchema,
        },
        page1a1: {
          path: 'enrolled-champva',
          title: 'Your CHAMPVA benefit status',
          ...certifierBenefitStatusSchema,
        },
        page1a2: {
          path: 'not-enrolled-champva',
          depends: isNotEnrolledInChampva,
          CustomPage: NotEnrolledPage,
          CustomPageReview: null,
          ...certifierNotEnrolledChampvaSchema,
        },
        page1a: {
          path: 'signer-info',
          title: 'Your name',
          depends: isRoleOther,
          ...certifierNameSchema,
        },
        page1b: {
          path: 'signer-mailing-address',
          title: 'Your mailing address',
          depends: isRoleOther,
          ...certifierAddressSchema,
        },
        page1c: {
          path: 'signer-contact-info',
          title: 'Your contact information',
          depends: isRoleOther,
          ...certifierContactSchema,
        },
        page1d: {
          path: 'signer-relationship',
          title: 'Your relationship to the beneficiary',
          depends: isRoleOther,
          ...certifierRelationshipSchema,
        },
        page1e: {
          path: 'champva-claim-status',
          title: 'CHAMPVA claim status',
          depends: isResubmissionEnabled,
          ...certifierClaimStatusSchema,
        },
      },
    },
    resubmissionInformation: {
      title: 'Resubmission information',
      pages: {
        page1e1: {
          path: 'resubmission-claim-number',
          title: 'Claim ID number',
          depends: isResubmissionClaim,
          ...claimIdentificationNumber,
        },
        page1e2: {
          path: 'resubmission-letter',
          title: 'CHAMPVA resubmission letter',
          depends: isResubmissionClaim,
          CustomPage: FileFieldCustomSimple,
          CustomPageReview: null,
          ...resubmissionLetterUpload,
        },
        page1e3: {
          path: 'resubmission-supporting-docs',
          title: 'Supporting documents for claim',
          depends: isResubmissionClaim,
          CustomPage: FileFieldCustomSimple,
          CustomPageReview: null,
          ...resubmissionDocsUpload,
        },
      },
    },
    sponsorInformation: {
      title: 'Veteran information',
      pages: {
        page2: {
          path: 'sponsor-info',
          title: 'Veteran full name',
          ...sponsorNameSchema,
        },
        page2a1: {
          path: 'sponsor-mailing-address',
          title: 'Veteran mailing address',
          depends: isRoleSponsor,
          ...sponsorAddressSchema,
        },
        page2a2: {
          path: 'sponsor-contact-info',
          title: 'Veteran contact information',
          depends: isRoleSponsor,
          ...sponsorContactSchema,
        },
      },
    },
    beneficiaryInformation: {
      title: 'Beneficiary information',
      pages: {
        page2a: {
          path: 'beneficiary-info',
          title: 'Beneficiary information',
          ...applicantNameDobSchema,
        },
        page2b: {
          path: 'beneficiary-identification-info',
          title: 'Beneficiary CHAMPVA member number',
          ...applicantMemberNumberSchema,
        },
        page2c: {
          path: 'beneficiary-address',
          title: 'Beneficiary address',
          depends: canSelectAddress,
          CustomPage: props => {
            const opts = { ...props, dataKey: 'applicantAddress' };
            return AddressSelectionPage(opts);
          },
          CustomPageReview: null,
          uiSchema: {},
          schema: blankSchema,
        },
        page2d: {
          path: 'beneficiary-mailing-address',
          title: 'Beneficiary mailing address',
          ...applicantAddressSchema,
        },
        page2e: {
          path: 'beneficiary-contact-info',
          title: 'Beneficiary contact information',
          ...applicantContactSchema,
        },
      },
    },
    healthInsuranceInformation: {
      title: 'Health insurance information',
      pages: {
        page3: {
          path: 'insurance-status',
          title: 'Beneficiary health insurance status',
          depends: isNewClaim,
          ...insuranceStatusSchema,
        },
        ...insurancePages,
      },
    },
    claimInformation: {
      title: 'Claim information',
      pages: {
        page4: {
          path: 'claim-type',
          title: 'Claim type',
          depends: isNewClaim,
          ...claimTypeSchema,
        },
        page5: {
          path: 'claim-work',
          title: 'Claim relationship to work',
          depends: isNewClaim,
          ...claimWorkSchema,
        },
        page6: {
          path: 'claim-auto-accident',
          title: 'Claim relationship to a car accident',
          depends: isNewClaim,
          ...claimAutoSchema,
        },
        page7: {
          path: 'medical-claim-upload',
          title: 'Supporting documents',
          depends: isNewMedicalClaim,
          ...medicalClaimUploadSchema,
        },
        page8: {
          path: 'eob-upload',
          title: 'Explanation of benefits',
          depends: hasOhiAndMedicalClaim,
          ...eobUploadSchema(true),
        },
        page9: {
          path: 'additional-eob-upload',
          title: 'Additional explanation of benefits',
          depends: hasOhiMedicalAndMultiplePolicies,
          ...eobUploadSchema(false),
        },
        page10: {
          path: 'pharmacy-claim-upload',
          title: 'Supporting document for prescription medication claim',
          depends: isNewPharmacyClaim,
          ...pharmacyClaimUploadSchema,
        },
      },
    },
  },
};

export default formConfig;
