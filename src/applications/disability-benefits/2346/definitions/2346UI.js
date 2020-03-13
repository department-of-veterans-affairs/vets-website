import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import React from 'react';
import fullSchema from '../2346-schema.json';
import deviceNameField from '../components/accessoriesCustomFields/deviceNameField';
import lastOrderDateField from '../components/accessoriesCustomFields/lastOrderDateField';
import productIdField from '../components/accessoriesCustomFields/productIdField';
import productNameField from '../components/accessoriesCustomFields/productNameField';
import quantityField from '../components/accessoriesCustomFields/quantityField';
import sizeField from '../components/accessoriesCustomFields/sizeField';
import emptyField from '../components/emptyField';
import addressFields from '../components/fields/addressFields';
import orderSupplyPageContent from '../components/oderSupplyPageContent';
import SuppliesReview from '../components/suppliesReview';
// import * as address from 'platform/forms-system/src/js/definitions/address';

const addressUIDescription = (
  <>
    <p>
      Your order will ship to this address. Orders typically arrive with 7-10
      business days.
    </p>
    <br />
    <p className="vads-u-font-weight--bold">
      Select the address you would like us to send your order to:{' '}
      <span className="red vads-u-font-weight--normal">*(Required)</span>
    </p>
  </>
);

const emailUITitle = (
  <>
    <p className="vads-u-font-weight--bold">Email Address</p>
  </>
);

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    dateOfBirthUI: currentOrPastDateUI('Date of Birth'),
    fullNameUI,
    addressUI: {
      'ui:title': 'Shipping Address',
      'ui:description': addressUIDescription,
      'ui:field': addressFields,
    },
    emailUI: {
      'ui:title': emailUITitle,
      'ui:description':
        'We will send an order confirmation email with a tracking number to this email address.',
      'ui:widget': 'email',
      'ui:errorMessages': {
        pattern: 'Please enter an email address using this format: X@X.com',
        required: 'Please enter an email address',
      },
      'ui:options': {
        widgetClassNames: 'va-input-large',
        inputType: 'email',
      },
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
