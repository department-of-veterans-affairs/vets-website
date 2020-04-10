/* eslint-disable camelcase */
import { VA_FORM_IDS } from 'platform/forms/constants';
import fullSchemaMDOT from '../2346-schema.json';
import personalInfoBox from '../components/personalInfoBox';
import orderSupplyPageContent from '../components/oderSupplyPageContent';
import orderAccessoriesPageContent from '../components/orderAccessoriesPageContent';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
// import deviceNameField from '../components/supplyCustomFields/deviceNameField';
import productNameField from '../components/supplyCustomFields/productNameField';
import quantityField from '../components/supplyCustomFields/quantityField';
import productIdField from '../components/supplyCustomFields/productIdField';
import lastOrderDateField from '../components/supplyCustomFields/lastOrderDateField';
// import sizeField from '../components/supplyCustomFields/sizeField';
import emptyField from '../components/emptyField';
import SuppliesReview from '../components/suppliesReview';
import { vetFields } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../components/IntroductionPage';
import UIDefinitions from '../definitions/2346UI';

const {
  email,
  dateOfBirth,
  gender,
  address,
  supplies,
  accessories,
} = fullSchemaMDOT.definitions;

const { veteranAddress } = fullSchemaMDOT.properties;

const { emailUI, addressUI } = UIDefinitions.sharedUISchemas;

const formChapters = {
  veteranInformation: 'Veteran Information',
  orderSupplies: 'Order your supplies',
};

const formPages = {
  personalDetails: 'Personal Details',
  confirmAddress: 'Shipping Address',
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
  title: 'Reorder Hearing Aid Batteries and Accessories',
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
    accessories,
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
    OrderSuppliesChapter: {
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
              },
              'ui:reviewField': SuppliesReview,
            },
            supplies: {
              'ui:title': 'Which hearing aid do you need batteries for?',
              'ui:description':
                'You will be sent a 6 month supply of batteries for each device you select below.',
              'ui:field': 'StringField',
              'ui:widget': SelectArrayItemsWidget,
              'ui:validations': [
                {
                  options: { selectedPropName: 'view:selected' },
                },
              ],
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
              },
              'ui:reviewField': SuppliesReview,
            },
            accessories: {
              'ui:title': 'Which hearing aid do you need batteries for?',
              'ui:description':
                'You will be sent a 6 month supply of batteries for each device you select below.',
              'ui:options': {
                expandUnder: 'view:addAccessories',
                expandUnderCondition: 'yes',
              },
              product_name: {
                'ui:title': '  ',
                'ui:field': productNameField,
                'ui:reviewField': SuppliesReview,
                'ui:options': {
                  classNames: 'order-background',
                },
              },
              quantity: {
                'ui:title': '  ',
                'ui:field': quantityField,
                'ui:reviewField': SuppliesReview,
                'ui:options': {
                  classNames: 'order-background',
                },
              },
              product_id: {
                'ui:title': '  ',
                'ui:field': productIdField,
                'ui:reviewField': SuppliesReview,
                'ui:options': {
                  classNames: 'order-background',
                },
              },
              last_order_date: {
                'ui:title': '  ',
                'ui:field': lastOrderDateField,
                'ui:reviewField': SuppliesReview,
                'ui:options': {
                  classNames: 'order-background',
                },
              },
              product_group: {
                'ui:title': '  ',
                'ui:field': emptyField,
                'ui:reviewField': SuppliesReview,
              },
              available_for_reorder: {
                'ui:title': '  ',
                'ui:field': emptyField,
                'ui:reviewField': SuppliesReview,
              },
              next_availability_date: {
                'ui:title': '  ',
                'ui:field': emptyField,
                'ui:reviewField': SuppliesReview,
              },
            },
          },
        },
      },
    },
  },
};
export default formConfig;
