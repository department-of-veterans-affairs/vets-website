import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';

// import fullSchema from 'vets-json-schema/dist/21A-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

const { fullName, date } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '21a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21a',
  saveInProgress: {
    messages: {
      inProgress:
        'Your application to become a VA accredited attorney or claims agent (21a) is in progress.',
      expired:
        'Your saved application to become a VA accredited attorney or claims agent (21a) has expired. If you want to apply to become a VA accredited attorney or claims agent, please start a new application.',
      saved:
        'Your application to become a VA accredited attorney or claims agent (21a) has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply to become a VA accredited attorney or claims agent.',
    noAuth:
      'Please sign in again to continue your application to become a VA accredited attorney or claims agent.',
  },
  title: 'Apply to become a VA accredited attorney or claims agent',
  subTitle: 'VA Form 21a',
  defaultDefinitions: {
    fullName,
    date,
  },
  chapters: {
    personalInformationChapter: {
      title: 'Personal information',
      pages: {
        personalInformation: {
          path: 'personal-information',
          title: 'Personal information',
          uiSchema: {
            fullName: fullNameUI,
          },
          schema: {
            type: 'object',
            required: ['fullName'],
            properties: {
              fullName,
            },
          },
        },
        placeOfBirth: {
          path: 'place-of-birth',
          title: 'Place of birth',
          uiSchema: {},
          schema: {
            type: 'object',
            required: [],
            properties: {},
          },
        },
      },
    },
    employmentInformationChapter: {
      title: 'Employment information',
      pages: {
        currentEmployerAndPositionInformation: {
          path: 'current-employer-information',
          title: 'Current employer and position information',
          uiSchema: {},
          schema: {
            type: 'object',
            required: [],
            properties: {},
          },
        },
        currentEmployerAddressAndPhoneNumber: {
          path: 'current-employer-address-phone',
          title: 'Current employer address and phone number',
          uiSchema: {},
          schema: {
            type: 'object',
            required: [],
            properties: {},
          },
        },
      },
    },
  },
};

export default formConfig;
