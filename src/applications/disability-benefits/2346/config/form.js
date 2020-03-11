/* eslint-disable camelcase */
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
  gender,
  address,
  supplies,
  yesOrNo,
} = fullSchemaMDOT.definitions;

const { addressField, emailField, yesOrNoField, suppliesField } = vetFields;

const { veteranAddress } = fullSchemaMDOT.properties;

const {
  emailUI,
  addressUI,
  addBatteriesUI,
  addAccessoriesUI,
  batteriesUI,
  accessoriesUI,
} = UIDefinitions.sharedUISchemas;

const formChapters = {
  veteranInformation: 'Veteran Information',
  orderSupplies: 'Order your supplies',
};

const formPages = {
  personalDetails: 'Personal Details',
  confirmAddress: 'Shipping Address',
  addBatteriesPage: 'Add batteries to your order',
  addAccessoriesPage: 'Add accessories to your order',
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
    address,
    gender,
    supplies,
    yesOrNo,
  },
  chapters: {
    veteranInformationChapter: {
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
            [addressField]: addressUI,
            [emailField]: emailUI,
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
    orderSuppliesChapter: {
      title: formChapters.orderSupplies,
      pages: {
        [formPages.addBatteriesPage]: {
          path: 'supplies',
          title: formPages.addBatteriesPage,
          schema: {
            type: 'object',
            properties: {
              yesOrNo,
              supplies,
            },
          },
          uiSchema: {
            [yesOrNoField]: addBatteriesUI,
            [suppliesField]: batteriesUI,
          },
        },
        [formPages.addAccessoriesPage]: {
          path: 'accessories',
          title: formPages.addAccessoriesPage,
          schema: {
            type: 'object',
            properties: {
              yesOrNo,
              supplies,
            },
          },
          uiSchema: {
            [yesOrNoField]: addAccessoriesUI,
            [suppliesField]: accessoriesUI,
          },
        },
      },
    },
  },
};
export default formConfig;
