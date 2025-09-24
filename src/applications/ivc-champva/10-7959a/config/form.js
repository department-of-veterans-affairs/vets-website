import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import GetFormHelp from '../../shared/components/GetFormHelp';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import SubmissionError from '../../shared/components/SubmissionError';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from './submitTransformer';
import { nameWording, privWrapper } from '../../shared/utilities';
import { FileFieldCustomSimple } from '../../shared/components/fileUploads/FileUpload';
import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';
import {
  certifierRoleSchema,
  certifierReceivedPacketSchema,
  certifierNotEnrolledChampvaSchema,
  certifierNameSchema,
  certifierAddressSchema,
  certifierContactSchema,
  certifierRelationshipSchema,
  certifierClaimStatusSchema,
} from '../chapters/signerInformation';
import { NotEnrolledChampvaPage } from '../chapters/NotEnrolledChampvaPage';
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
  claimIdentifyingNumber,
  claimType,
  medicalClaimDetails,
  medicalUploadSupportingDocs,
  pharmacyClaimDetails,
  pharmacyClaimUploadDocs,
} from '../chapters/resubmission';

// import mockData from '../tests/e2e/fixtures/data/test-data.json';

// first name posessive
function fnp(formData) {
  return nameWording(formData, undefined, undefined, true);
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  transformForSubmit,
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  footerContent: GetFormHelp,
  trackingPrefix: '10-7959a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  submissionError: SubmissionError,
  formId: '10-7959A',
  saveInProgress: {
    messages: {
      inProgress:
        'Your CHAMPVA claim form application (10-7959A) is in progress.',
      expired:
        'Your saved CHAMPVA claim form application (10-7959A) has expired. If you want to apply for CHAMPVA claim form, please start a new application.',
      saved: 'Your CHAMPVA claim form application has been saved.',
    },
  },
  customText: {
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    startNewAppButtonText: 'Start a new form',
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
    notFound: 'Please start over to apply for CHAMPVA claim form.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA claim form.',
  },
  title: 'File a CHAMPVA claim',
  subTitle: 'CHAMPVA Claim Form (VA Form 10-7959a)',
  defaultDefinitions: {},
  chapters: {
    signerInformation: {
      title: 'Signer information',
      pages: {
        page1: {
          path: 'signer-type',
          title: 'Your information',
          // initialData: mockData.data,
          // Placeholder data so that we display "beneficiary" in title when `fnp` is used
          ...certifierRoleSchema,
        },
        page1a1: {
          path: 'enrolled-champva',
          title: 'Your CHAMPVA benefit status',
          ...certifierReceivedPacketSchema,
        },
        page1a2: {
          path: 'not-enrolled-champva',
          title: 'Wait until you receive CHAMPVA packet',
          depends: formData => !get('certifierReceivedPacket', formData),
          CustomPage: NotEnrolledChampvaPage,
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
          title: 'Your CHAMPVA claim status',
          // If the feature toggle is enabled, show this page:
          depends: formData => formData.champvaEnableClaimResubmitQuestion,
          ...certifierClaimStatusSchema,
        },
      },
    },
    resubmissionInformation: {
      title: 'Claim information',
      pages: {
        page1e1: {
          path: 'resubmission-claim-number',
          title: 'Claim ID number',
          depends: formData => get('claimStatus', formData) === 'resubmission',
          ...claimIdentifyingNumber,
        },
        page1f: {
          path: 'resubmission-claim-type',
          title: 'Claim type',
          depends: formData => get('claimStatus', formData) === 'resubmission',
          ...claimType,
        },
        page1g: {
          path: 'resubmission-medical-claim-details',
          title: 'Claim details',
          depends: formData =>
            get('claimStatus', formData) === 'resubmission' &&
            get('claimType', formData) === 'medical',
          ...medicalClaimDetails,
        },
        page1h: {
          path: 'resubmission-medical-supporting-docs',
          title: 'claim details',
          depends: formData =>
            get('claimStatus', formData) === 'resubmission' &&
            get('claimType', formData) === 'medical',
          CustomPage: FileFieldCustomSimple,
          CustomPageReview: null,
          ...medicalUploadSupportingDocs,
        },
        pageij: {
          path: 'resubmission-pharmacy-claim-details',
          title: 'claim details',
          depends: formData =>
            get('claimStatus', formData) === 'resubmission' &&
            get('claimType', formData) === 'pharmacy',
          ...pharmacyClaimDetails,
        },
        page1k: {
          path: 'resubmission-pharmacy-supporting-docs',
          title: 'Upload support documents for your pharmacy claim',
          depends: formData =>
            get('claimStatus', formData) === 'resubmission' &&
            get('claimType', formData) === 'pharmacy',
          CustomPage: FileFieldCustomSimple,
          CustomPageReview: null,
          ...pharmacyClaimUploadDocs,
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
          title: formData =>
            privWrapper(`${fnp(formData)} CHAMPVA member number`),
          ...applicantMemberNumberSchema,
        },
        page2c: {
          path: 'beneficiary-address',
          title: formData => privWrapper(`${fnp(formData)} address`),
          // Only show if we have addresses to pull from:
          depends: formData =>
            get('certifierRole', formData) !== 'applicant' &&
            (get('street', formData?.certifierAddress) ||
              get('street', formData?.sponsorAddress)),
          CustomPage: props => {
            const extraProps = {
              ...props,
              customTitle: privWrapper(`${fnp(props.data)} address`),
              customDescription:
                'We’ll send any important information about this form to this address.',
              customSelectText: `Does ${nameWording(
                props.data,
                false,
                false,
                true,
              )} have the same address as you?`,
              positivePrefix: 'Yes, their address is',
              negativePrefix: 'No, they have a different address',
            };
            return ApplicantAddressCopyPage(extraProps);
          },
          CustomPageReview: null,
          uiSchema: {},
          schema: blankSchema,
        },
        page2d: {
          path: 'beneficiary-mailing-address',
          title: formData => privWrapper(`${fnp(formData)} mailing address`),
          ...applicantAddressSchema,
        },
        page2e: {
          path: 'beneficiary-contact-info',
          title: formData => privWrapper(`${fnp(formData)} phone number`),
          ...applicantContactSchema,
        },
      },
    },
    healthInsuranceInformation: {
      title: 'Health insurance information',
      pages: {
        page3: {
          path: 'insurance-status',
          title: props => {
            return privWrapper(
              `${fnp(props.formData ?? props)} health insurance status`,
            );
          },
          depends: formData => get('claimStatus', formData) !== 'resubmission',
          ...insuranceStatusSchema,
        },
        ...insurancePages, // Array builder/list loop pages
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
          title: formData =>
            `Upload explanation of benefits from ${get(
              'policies[0].name',
              formData,
            )}`,
          depends: formData =>
            get('hasOhi', formData) && get('claimType', formData) === 'medical',
          ...eobUploadSchema(true),
        },
        page9: {
          path: 'additional-eob-upload',
          title: formData =>
            `Upload explanation of benefits from ${get(
              'policies[1].name',
              formData,
            )}`,
          depends: formData =>
            get('hasOhi', formData) &&
            get('claimType', formData) === 'medical' &&
            get('policies', formData) &&
            formData?.policies?.length > 1,
          ...eobUploadSchema(false),
        },
        page10: {
          path: 'pharmacy-claim-upload',
          title: 'Upload supporting document for prescription medication claim',
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
