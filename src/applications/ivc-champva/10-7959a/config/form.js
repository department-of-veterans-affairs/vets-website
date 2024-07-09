// import fullSchema from 'vets-json-schema/dist/10-7959A-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { nameWording } from '../../shared/utilities';
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

import { sponsorNameSchema } from '../chapters/sponsorInformation';

// import mockData from '../tests/fixtures/data/test-data.json';

// first name posessive
function fnp(formData) {
  return nameWording(formData, undefined, undefined, true);
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-7959a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
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
          path: 'first-page',
          title: 'First Page',
          // Placeholder data so that we display "beneficiary" in title when `fnp` is used
          // initialData: mockData.data,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        page2: {
          path: 'sponsor-information',
          title: 'Name',
          ...sponsorNameSchema,
        },
      },
    },
    healthInsuranceInformation: {
      title: 'Health insurance information',
      pages: {
        page3: {
          path: 'insurance-status',
          title: formData => `${fnp(formData)} health insurance status`,
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
          ...claimTypeSchema,
        },
        page5: {
          path: 'claim-work',
          title: 'Claim relation to work',
          ...claimWorkSchema,
        },
        page6: {
          path: 'claim-auto-accident',
          title: 'Claim relation to an auto-related accident',
          ...claimAutoSchema,
        },
        page7: {
          path: 'medical-claim-upload',
          title: 'Supporting documents',
          depends: formData => get('claimIsWorkRelated', formData),
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
            get('policies', formData).length > 1,
          ...eobUploadSchema(false),
        },
        page10: {
          path: 'pharmacy-claim-upload',
          title: 'Upload supporting document for prescription claim',
          depends: formData => get('claimType', formData) === 'pharmacy',
          ...pharmacyClaimUploadSchema,
        },
      },
    },
  },
};

export default formConfig;
