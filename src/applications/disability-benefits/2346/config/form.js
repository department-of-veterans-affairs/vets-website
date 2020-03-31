import { VA_FORM_IDS } from 'platform/forms/constants';
import fullSchemaMDOT from '../2346-schema.json';
import personalInfoBox from '../components/personalInfoBox';
import orderSupplyPageContent from '../components/orderSupplyPageContent';
import orderAccessoriesPageContent from '../components/orderAccessoriesPageContent';
import SelectArrayItemsBatteriesWidget from '../components/SelectArrayItemsBatteriesWidget';
import SelectArrayItemsAccessoriesWidget from '../components/SelectArrayItemsAccessoriesWidget';
import { schemaFields } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';
import UIDefinitions from '../definitions/2346UI';

const {
  email,
  date,
  gender,
  address,
  supplies,
  accessories,
  yesOrNo,
} = fullSchemaMDOT.definitions;

const { permAddressField, tempAddressField, emailField } = schemaFields;

const { permanentAddress, temporaryAddress } = fullSchemaMDOT.properties;

const { emailUI, permAddressUI, tempAddressUI } = UIDefinitions.sharedUISchemas;

const formChapters = {
  veteranInformation: 'Veteran Information',
  orderSupplies: 'Order your supplies',
};

const formPages = {
  personalDetails: 'Personal Details',
  address: 'Shipping Address',
  orderSuppliesPage: 'Add batteries to your order',
  orderAccessoriesPage: 'Add accessories to your order',
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
    accessories,
    email,
    date,
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
          title: formPages.address,
          uiSchema: {
            [permAddressField]: permAddressUI,
            [tempAddressField]: tempAddressUI,
            [emailField]: emailUI,
          },
          schema: {
            type: 'object',
            properties: {
              permanentAddress,
              temporaryAddress,
              email,
            },
          },
        },
      },
    },
    orderSuppliesChapter: {
      title: formChapters.orderSupplies,
      pages: {
        [formPages.orderSuppliesPage]: {
          path: 'supplies',
          title: formPages.orderSuppliesPage,
          schema: {
            type: 'object',
            properties: {
              'view:addBatteries': {
                type: 'string',
                enum: ['yes', 'no'],
              },
              supplies,
            },
          },
          uiSchema: {
            'view:addBatteries': {
              'ui:title': 'Add batteries to your order',
              'ui:description': orderSupplyPageContent,
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes, I need to order hearing aid batteries.',
                  no: "No, I don't need to order hearing aid batteries.",
                },
                hideOnReview: true,
              },
            },
            supplies: {
              'ui:title': 'Which hearing aid do you need batteries for?',
              'ui:description':
                'You will be sent a 6 month supply of batteries for each device you select below.',
              'ui:field': SelectArrayItemsBatteriesWidget,
              'ui:options': {
                expandUnder: 'view:addBatteries',
                expandUnderCondition: 'yes',
              },
            },
          },
        },
        [formPages.orderAccessoriesPage]: {
          path: 'accessories',
          title: formPages.orderAccessoriesPage,
          schema: {
            type: 'object',
            properties: {
              'view:addAccessories': {
                type: 'string',
                enum: ['yes', 'no'],
              },
              accessories,
            },
          },
          uiSchema: {
            'view:addAccessories': {
              'ui:title': 'Add hearing aid accessories to your order',
              'ui:description': orderAccessoriesPageContent,
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes, I need to order hearing aid accessories.',
                  no: "No, I don't need to order hearing aid accessories.",
                },
                hideOnReview: true,
              },
            },
            accessories: {
              'ui:title': 'Which hearing aid do you need batteries for?',
              'ui:description':
                'You will be sent a 6 month supply of batteries for each device you select below.',
              'ui:field': SelectArrayItemsAccessoriesWidget,
              'ui:options': {
                expandUnder: 'view:addAccessories',
                expandUnderCondition: 'yes',
              },
            },
          },
        },
      },
    },
  },
};
export default formConfig;
