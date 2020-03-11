import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import fullSchema from '../2346-schema.json';
import deviceNameField from '../components/accessoriesCustomFields/deviceNameField';
import lastOrderDateField from '../components/accessoriesCustomFields/lastOrderDateField';
import productIdField from '../components/accessoriesCustomFields/productIdField';
import productNameField from '../components/accessoriesCustomFields/productNameField';
import quantityField from '../components/accessoriesCustomFields/quantityField';
import sizeField from '../components/accessoriesCustomFields/sizeField';
import emptyField from '../components/emptyField';
import orderSupplyPageContent from '../components/oderSupplyPageContent';
import SuppliesReview from '../components/suppliesReview';

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    dateOfBirthUI: currentOrPastDateUI('Date of Birth'),
    fullNameUI,
    addressUI: address.uiSchema('Confirm your address', false),
    emailUI: {
      'ui:title': 'Confirm your email address',
      'ui:widget': 'email',
    },
    genderUI: {
      'ui:title': 'Gender',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          F: 'Female',
          M: 'Male',
        },
      },
    },
    addBatteriesUI: {
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
    addAccessoriesUI: {
      'ui:title': 'Add accessories to your order',
      'ui:description': orderSupplyPageContent,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes, I need to order hearing aid accessories.',
          no: "No, I don't need to order hearing aid accessories.",
        },
      },
      'ui:reviewField': SuppliesReview,
    },
    batteriesUI: {
      'ui:title': 'Which hearing aid do you need batteries for?',
      'ui:description':
        'You will be sent a 6 month supply of batteries for each device you select below.',
      'ui:options': {
        expandUnder: 'yesOrNo',
        expandUnderCondition: 'yes',
      },
      deviceName: {
        'ui:title': '  ',
        'ui:field': deviceNameField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productName: {
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
      productId: {
        'ui:title': '  ',
        'ui:field': productIdField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      lastOrderDate: {
        'ui:title': '  ',
        'ui:field': lastOrderDateField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      size: {
        'ui:title': '  ',
        'ui:field': sizeField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productGroup: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      availableForReorder: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      nextAvailabilityDate: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
    },
    accessoriesUI: {
      'ui:title': 'Which hearing aid do you need batteries for?',
      'ui:description':
        'You will be sent a 6 month supply of batteries for each device you select below.',
      'ui:options': {
        expandUnder: 'yesOrNo',
        expandUnderCondition: 'yes',
      },
      deviceName: {
        'ui:title': '  ',
        'ui:field': deviceNameField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productName: {
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
      productId: {
        'ui:title': '  ',
        'ui:field': productIdField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      lastOrderDate: {
        'ui:title': '  ',
        'ui:field': lastOrderDateField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
      productGroup: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      availableForReorder: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      nextAvailabilityDate: {
        'ui:title': '  ',
        'ui:field': emptyField,
        'ui:reviewField': SuppliesReview,
      },
      size: {
        'ui:title': '  ',
        'ui:field': sizeField,
        'ui:reviewField': SuppliesReview,
        'ui:options': {
          classNames: 'order-background',
        },
      },
    },
  },
};
