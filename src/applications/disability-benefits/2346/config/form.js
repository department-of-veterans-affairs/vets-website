/* eslint-disable camelcase */
import { VA_FORM_IDS } from 'platform/forms/constants';
import fullSchemaMDOT from '../2346-schema.json';
import personalInfoBox from '../components/personalInfoBox';
import orderSupplyPageContent from '../components/oderSupplyPageContent';
import orderAccessoriesPageContent from '../components/orderAccessoriesPageContent';
import deviceNameField from '../components/customFields/deviceNameField';
import productNameField from '../components/customFields/productNameField';
import quantityField from '../components/customFields/quantityField';
import productIdField from '../components/customFields/productIdField';
import lastOrderDateField from '../components/customFields/lastOrderDateField';
import sizeField from '../components/customFields/sizeField';
import emptyField from '../components/customFields/emptyField';
import SuppliesReview from '../components/suppliesReview';
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
  supplies,
  accessories,
} = fullSchemaMDOT.definitions;

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
    veteranFullName,
    veteranAddress,
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
              'ui:options': {
                classNames: 'order-background',
                expandUnder: 'view:addBatteries',
                expandUnderCondition: 'yes',
              },
              device_name: {
                'ui:title': '  ',
                'ui:field': deviceNameField,
                'ui:reviewField': SuppliesReview,
              },
              product_name: {
                'ui:title': '  ',
                'ui:field': productNameField,
                'ui:reviewField': SuppliesReview,
              },
              quantity: {
                'ui:title': '  ',
                'ui:field': quantityField,
                'ui:reviewField': SuppliesReview,
              },
              product_id: {
                'ui:title': '  ',
                'ui:field': productIdField,
                'ui:reviewField': SuppliesReview,
              },
              last_order_date: {
                'ui:title': '  ',
                'ui:field': lastOrderDateField,
                'ui:reviewField': SuppliesReview,
              },
              size: {
                'ui:title': '  ',
                'ui:field': sizeField,
                'ui:reviewField': SuppliesReview,
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
                classNames: 'order-background',
                expandUnder: 'view:addAccessories',
                expandUnderCondition: 'yes',
              },
              product_name: {
                'ui:title': '  ',
                'ui:field': productNameField,
                'ui:reviewField': SuppliesReview,
              },
              quantity: {
                'ui:title': '  ',
                'ui:field': quantityField,
                'ui:reviewField': SuppliesReview,
              },
              product_id: {
                'ui:title': '  ',
                'ui:field': productIdField,
                'ui:reviewField': SuppliesReview,
              },
              last_order_date: {
                'ui:title': '  ',
                'ui:field': lastOrderDateField,
                'ui:reviewField': SuppliesReview,
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
