import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import React from 'react';
import orderSupplyPageContent from '../../components/oderSupplyPageContent';
import orderAccessoriesPageContent from '../../components/orderAccessoriesPageContent';
import SelectArrayItemsAccessoriesWidget from '../../components/SelectArrayItemsAccessoriesWidget';
import SelectArrayItemsBatteriesWidget from '../../components/SelectArrayItemsBatteriesWidget';
import { schemaFields } from '../../constants';
import fullSchema from '../2346-schema.json';
import { addressUISchema } from '../address-schema';

const { viewAddAccessoriesField, viewAddBatteriesField } = schemaFields;

const emailUITitle = (
  <>
    <h4>Email address</h4>
  </>
);

const emailUIDescription = (
  <>
    <p>
      We will send an order confirmation email with a tracking number to this
      email address.
    </p>
    <p>Email address</p>
  </>
);

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    permAddressUI: {
      ...addressUISchema(true, 'permanentAddress', () => true),
      'ui:title': 'Permanent Address',
      'ui:field': ReviewCardField,
      'ui:widget': 'radio',
      'ui:options': {
        viewComponent: AddressViewField,
      },
    },
    tempAddressUI: {
      ...addressUISchema(true, 'temporaryAddress', () => true),
      'ui:title': 'Temporary Address',
      'ui:field': ReviewCardField,
      'ui:widget': 'radio',
      'ui:options': {
        viewComponent: AddressViewField,
      },
    },
    selectedAddressUI: {
      'ui:title': 'Select which address to send your products to:',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          permanentAddress: 'Permanent Address',
          temporaryAddress: 'Temporary Address',
        },
      },
    },
    emailUI: {
      'ui:title': emailUITitle,
      'ui:description': emailUIDescription,
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
    addBatteriesUI: {
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
    addAccessoriesUI: {
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
    batteriesUI: {
      'ui:title': 'Which hearing aid do you need batteries for?',
      'ui:description':
        'You will be sent a 6 month supply of batteries for each device you select below.',
      'ui:field': SelectArrayItemsBatteriesWidget,
      'ui:options': {
        expandUnder: viewAddBatteriesField,
        expandUnderCondition: 'yes',
      },
    },
    accessoriesUI: {
      'ui:title': 'Which hearing aid do you need accessories for?',
      'ui:description':
        'You will be sent a 6 month supply of batteries for each device you select below.',
      'ui:field': SelectArrayItemsAccessoriesWidget,
      'ui:options': {
        expandUnder: viewAddAccessoriesField,
        expandUnderCondition: 'yes',
      },
    },
  },
};
