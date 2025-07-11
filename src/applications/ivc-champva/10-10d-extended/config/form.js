import get from '@department-of-veterans-affairs/platform-forms-system/get';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import { TITLE, SUBTITLE } from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SubmissionError from '../../shared/components/SubmissionError';
import GetFormHelp from '../../shared/components/GetFormHelp';
import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';
import { sponsorWording } from '../../10-10D/helpers/utilities';

import {
  certifierRoleSchema,
  certifierNameSchema,
  certifierAddressSchema,
  signerContactInfoPage,
  SignerContactInfoPage,
  certifierRelationshipSchema,
} from '../chapters/signerInformation';

// import mockData from '../tests/fixtures/data/test-data.json';
import transformForSubmit from './submitTransformer';

import {
  sponsorNameDobSchema,
  sponsorIdentificationSchema,
  sponsorStatus,
  sponsorStatusDetails,
  sponsorAddress,
  sponsorContactInfo,
  sponsorIntroSchema,
} from '../chapters/sponsorInformation';
import { applicantPages } from '../chapters/applicantInformation';
import {
  medicarePages,
  missingMedicarePage,
  proofOfIneligibilityUploadPage,
} from '../chapters/medicareInformation';
import { healthInsurancePages } from '../chapters/healthInsuranceInformation';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  showReviewErrors: true, // May want to hide in prod later, but for now keeping in due to complexity of this form
  transformForSubmit,
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms/10-10d-ext`,
  // submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  // TODO: when we have the submitUrl up and running, remove this dummy response:
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: _formData => 'certifierName',
    },
  },
  trackingPrefix: '10-10d-extended-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  submissionError: SubmissionError,
  customText: { appType: 'form' },
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/ivc-champva',
        label: 'Ivc champva',
      },
      {
        href: '/ivc-champva/10-10d-extended',
        label: '10 10d extended',
      },
    ],
  }),
  formId: VA_FORM_IDS.FORM_10_10D_EXTENDED,
  saveInProgress: {
    messages: {
      inProgress: 'Your CHAMPVA benefits application (10-10D) is in progress.',
      expired:
        'Your saved CHAMPVA benefits application (10-10D) has expired. If you want to apply for CHAMPVA benefits, please start a new application.',
      saved: 'Your CHAMPVA benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for CHAMPVA application (includes 10-7959c).',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA application (includes 10-7959c).',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    certifierInformation: {
      title: 'Signer information',
      pages: {
        page1: {
          // initialData: mockData.data,
          path: 'signer-type',
          title: 'Which of these best describes you?',
          ...certifierRoleSchema,
        },
        page2: {
          path: 'signer-info',
          title: 'Your name',
          ...certifierNameSchema,
        },
        page3: {
          path: 'signer-mailing-address',
          title: 'Your mailing address',
          ...certifierAddressSchema,
        },
        page4: {
          path: 'signer-contact-info',
          title: 'Your contact information',
          CustomPage: SignerContactInfoPage,
          CustomPageReview: null,
          ...signerContactInfoPage,
        },
        page5: {
          path: 'signer-relationship',
          title: 'Your relationship to applicant',
          depends: formData => get('certifierRole', formData) === 'other',
          ...certifierRelationshipSchema,
        },
      },
    },
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        page5a: {
          path: 'sponsor-intro',
          title: 'Sponsor information',
          ...sponsorIntroSchema,
        },
        page6: {
          path: 'sponsor-info',
          title: 'Sponsor’s name and date of birth',
          ...sponsorNameDobSchema,
        },
        page7: {
          path: 'sponsor-identification-info',
          title: `Sponsor's identification information`,
          ...sponsorIdentificationSchema,
        },
        page8: {
          path: 'sponsor-status',
          title: 'Sponsor’s status',
          depends: formData => get('certifierRole', formData) !== 'sponsor',
          ...sponsorStatus,
        },
        page9: {
          path: 'sponsor-status-details',
          title: 'Sponsor’s status details',
          depends: formData =>
            get('certifierRole', formData) !== 'sponsor' &&
            get('sponsorIsDeceased', formData),
          ...sponsorStatusDetails,
        },
        page10b0: {
          path: 'sponsor-mailing-same',
          title: formData => `${sponsorWording(formData)} address selection`,
          // Only show if we have addresses to pull from:
          depends: formData =>
            !get('sponsorIsDeceased', formData) &&
            get('certifierRole', formData) !== 'sponsor' &&
            get('street', formData?.certifierAddress),
          CustomPage: props => {
            const extraProps = {
              ...props,
              customAddressKey: 'sponsorAddress',
              customTitle: `${sponsorWording(props.data)} address selection`,
              customDescription:
                'We’ll send any important information about this form to this address.',
              customSelectText: `Does ${sponsorWording(
                props.data,
                false,
                false,
              )} live at a previously entered address?`,
              positivePrefix: 'Yes, their address is',
              negativePrefix: 'No, they have a different address',
            };
            return ApplicantAddressCopyPage(extraProps);
          },
          CustomPageReview: null,
          uiSchema: {},
          schema: blankSchema,
        },
        page10: {
          path: 'sponsor-mailing-address',
          title: 'Sponsor’s mailing address',
          depends: formData => !get('sponsorIsDeceased', formData),
          ...sponsorAddress,
        },
        page11: {
          path: 'sponsor-contact-information',
          title: 'Sponsor’s contact information',
          depends: formData => !get('sponsorIsDeceased', formData),
          ...sponsorContactInfo,
        },
      },
    },
    applicantInformation: {
      title: 'Applicant information',
      pages: applicantPages,
    },
    medicareInformation: {
      title: 'Medicare information',
      pages: {
        ...medicarePages,
        page22: missingMedicarePage,
        page23: proofOfIneligibilityUploadPage,
      },
    },
    healthInsuranceInformation: {
      title: 'Health insurance information',
      pages: healthInsurancePages,
    },
  },
  footerContent: GetFormHelp,
};

export default formConfig;
