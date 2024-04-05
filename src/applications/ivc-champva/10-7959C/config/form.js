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

import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';

// import mockdata from '../tests/fixtures/data/test-data.json';

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
          // initialData: mockdata.data,
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
  },
};

export default formConfig;
