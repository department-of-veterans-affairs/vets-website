import { VA_FORM_IDS } from 'platform/forms/constants';
import fullSchemaMDOT from '../2346-schema.json';
import personalInfoBox from '../components/personalInfoBox';
import { vetFields } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import UIDefinitions from '../definitions/2346UI';

const {
  email,
  dateOfBirth,
  veteranFullName,
  veteranAddress,
  gender,
} = fullSchemaMDOT.definitions;

const { emailUI, addressUI } = UIDefinitions.sharedUISchemas;

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
  title: 'Order Hearing Aid Batteries and Accessories',
  subTitle: 'VA Form 2346A',
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  defaultDefinitions: {
    email,
    dateOfBirth,
    veteranFullName,
    veteranAddress,
    gender,
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
            properties: {},
          },
        },
        [formPages.address]: {
          path: 'veteran-information/addresses',
          title: formPages.confirmAddress,
          uiSchema: {
            [vetFields.address]: addressUI,
            [vetFields.email]: emailUI,
          },
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
