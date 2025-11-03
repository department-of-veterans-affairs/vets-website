import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import SubmissionError from '../../shared/components/SubmissionError';
import ConfirmationPage from '../containers/ConfirmationPage';
import FormFooter from '../components/FormFooter';
import transformForSubmit from './submitTransformer';
import { FileFieldCustomSimple } from '../../shared/components/fileUploads/FileUpload';
import NotEnrolledPage from '../components/FormPages/NotEnrolledPage';
import AddressSelectionPage from '../components/FormPages/AddressSelectionPage';
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
  blankSchema,
  sponsorAddressSchema,
  sponsorNameSchema,
  sponsorContactSchema,
} from '../chapters/sponsorInformation';

import {
  claimIdentificationNumber,
  resubmissionLetterUpload,
  resubmissionDocsUpload,
} from '../chapters/resubmission';

// import mockData from '../tests/e2e/fixtures/data/test-data.json';

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
      inProgress: 'Your CHAMPVA claim (10-7959A) is in progress.',
      expired:
        'Your saved CHAMPVA claim (10-7959A) has expired. If you want to file a CHAMPVA claim, please start a new form.',
      saved: 'Your CHAMPVA claim has been saved.',
    },
  },
  customText: {
    appType: 'claim',
    continueAppButtonText: 'Continue your claim',
    startNewAppButtonText: 'Start a new claim',
  },
  downtime: {
    dependencies: [externalServices.pega, externalServices.form107959a],
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: formData => {
        let val = 'applicantName';
        if (formData?.certifierRole === 'other') {
          val = 'certifierName';
        } else if (formData?.certifierRole === 'sponsor') {
          val = 'sponsorName';
        }
        return val;
      },
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to file a CHAMPVA claim.',
    noAuth: 'Please sign in again to continue your CHAMPVA claim.',
  },
  title: 'File a CHAMPVA claim',
  subTitle: 'CHAMPVA Claim Form (VA Form 10-7959a)',
  dev: { disableWindowUnloadInCI: true },
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
          depends: formData => !get('certifierReceivedPacket', formData),
          CustomPage: NotEnrolledPage,
          CustomPageReview: null,
          ...certifierNotEnrolledChampvaSchema,
        },
        page1a: {
          path: 'signer-info',
          title: 'Your name',
          depends: formData => get('certifierRole', formData) === 'other',
          ...certifierNameSchema,
        },
        page1b: {
          path: 'signer-mailing-address',
          title: 'Your mailing address',
          depends: formData => get('certifierRole', formData) === 'other',
          ...certifierAddressSchema,
        },
        page1c: {
          path: 'signer-contact-info',
          title: 'Your contact information',
          depends: formData => get('certifierRole', formData) === 'other',
          ...certifierContactSchema,
        },
        page1d: {
          path: 'signer-relationship',
          title: 'Your relationship to the beneficiary',
          depends: formData => get('certifierRole', formData) === 'other',
          ...certifierRelationshipSchema,
        },
        page1e: {
          path: 'is-resubmit',
          title: 'CHAMPVA claim status',
          depends: formData =>
            formData['view:champvaEnableClaimResubmitQuestion'],
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
          depends: formData => get('claimStatus', formData) === 'resubmission',
          ...claimIdentificationNumber,
        },
        page1e2: {
          path: 'resubmission-letter-upload',
          title: 'CHAMPVA resubmission letter',
          depends: formData => get('claimStatus', formData) === 'resubmission',
          CustomPage: FileFieldCustomSimple,
          CustomPageReview: null,
          ...resubmissionLetterUpload,
        },
        page1e3: {
          path: 'resubmission-supporting-docs-upload',
          title: 'Supporting documents for claim',
          depends: formData => get('claimStatus', formData) === 'resubmission',
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
          depends: formData => get('certifierRole', formData) === 'sponsor',
          ...sponsorAddressSchema,
        },
        page2a2: {
          path: 'sponsor-contact-info',
          title: 'Veteran contact information',
          depends: formData => get('certifierRole', formData) === 'sponsor',
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
          depends: formData =>
            get('certifierRole', formData) !== 'applicant' &&
            (get('street', formData?.certifierAddress) ||
              get('street', formData?.sponsorAddress)),
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
          depends: formData => get('claimStatus', formData) !== 'resubmission',
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
          depends: formData => get('claimStatus', formData) !== 'resubmission',
          ...claimTypeSchema,
        },
        page5: {
          path: 'claim-work',
          title: 'Claim relationship to work',
          depends: formData => get('claimStatus', formData) !== 'resubmission',
          ...claimWorkSchema,
        },
        page6: {
          path: 'claim-auto-accident',
          title: 'Claim relationship to a car accident',
          depends: formData => get('claimStatus', formData) !== 'resubmission',
          ...claimAutoSchema,
        },
        page7: {
          path: 'medical-claim-upload',
          title: 'Supporting documents',
          depends: formData =>
            get('claimType', formData) === 'medical' &&
            get('claimStatus', formData) !== 'resubmission',
          ...medicalClaimUploadSchema,
        },
        page8: {
          path: 'eob-upload',
          title: 'Explanation of benefits',
          depends: formData =>
            get('hasOhi', formData) && get('claimType', formData) === 'medical',
          ...eobUploadSchema(true),
        },
        page9: {
          path: 'additional-eob-upload',
          title: 'Additional explanation of benefits',
          depends: formData =>
            get('hasOhi', formData) &&
            get('claimType', formData) === 'medical' &&
            get('policies', formData) &&
            formData?.policies?.length > 1,
          ...eobUploadSchema(false),
        },
        page10: {
          path: 'pharmacy-claim-upload',
          title: 'Supporting document for prescription medication claim',
          depends: formData =>
            get('claimType', formData) === 'pharmacy' &&
            get('claimStatus', formData) !== 'resubmission',
          ...pharmacyClaimUploadSchema,
        },
      },
    },
  },
};

export default formConfig;
