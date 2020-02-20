import { VA_FORM_IDS } from 'platform/forms/constants';
import fullSchema from 'vets-json-schema/dist/MDOT-schema.json';
import personalInfoBox from '../components/personalInfoBox';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

const {
  email,
  dateOfBirth,
  veteranFullName,
  veteranAddress,
} = fullSchema.properties;

const { fullName, address, gender } = fullSchema.definitions;

const formChapters = {
  veteranInformation: 'Veteran Information',
};

const formPages = {
  personalDetails: 'Personal Details',
  confirmAddress: 'Confirm Address',
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/posts',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'va-2346a-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_VA_2346A,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  defaultDefinitions: {
    fullName,
    address,
  },
  chapters: {
    VeteranInformationChapter: {
      title: formChapters.veteranInformation,
      pages: {
        [formPages.personalDetails]: {
          path: 'veteran-information',
          title: formPages.personalDetails,
          uiSchema: {
            'ui:description': personalInfoBox,
          },
          schema: {
            type: 'object',
            properties: {
              veteranFullName,
              dateOfBirth,
              gender,
            },
          },
        },
        [formPages.address]: {
          path: 'veteran-information/addresses',
          title: formPages.confirmAddress,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {
              veteranAddress,
              email,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
