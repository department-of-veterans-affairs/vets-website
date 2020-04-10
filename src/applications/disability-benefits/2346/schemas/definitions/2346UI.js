import React from 'react';
import OrderAccessoriesPageContent from '../../components/OrderAccessoriesPageContent';
import OrderSupplyPageContent from '../../components/OrderSupplyPageContent';
import SelectArrayItemsAccessoriesWidget from '../../components/SelectArrayItemsAccessoriesWidget';
import SelectArrayItemsBatteriesWidget from '../../components/SelectArrayItemsBatteriesWidget';
import { schemaFields } from '../../constants';
import { getRadioLabelText, showNewAddressForm } from '../../helpers';
import fullSchema from '../2346-schema.json';
import { addressUISchema } from '../address-schema';

const { viewAddAccessoriesField, viewAddBatteriesField } = schemaFields;

const emailUITitle = <h4>Email address</h4>;

const emailUIDescription = (
  <>
    <p>
      We will send an order confirmation email with a tracking number to this
      email address.
    </p>
    <p>Email address</p>
  </>
);

const selectedAddressUIDescription = (
  <>
    <p>
      We'll ship your address to the address below. Orders typically arrive
      within 7 to 10 business days.
    </p>
  </>
);

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    selectedAddressUI: {
      'ui:widget': 'radio',
      'ui:title': 'Shipping Address',
      'ui:description': selectedAddressUIDescription,
      'ui:options': {
        updateSchema: formData => {
          const updatedEnumNames = ['permanentAddress', 'temporaryAddress'].map(
            address => getRadioLabelText(formData, address),
          );
          return {
            enumNames: [...updatedEnumNames, 'Add new address'],
            enum: ['permanentAddress', 'temporaryAddress', 'newAddress'],
          };
        },
      },
    },
    newAddressUI: {
      ...addressUISchema(
        true,
        'newAddress',
        formData => formData.currentAddress === 'newAddress',
      ),
      'ui:options': {
        expandUnder: 'selectedAddress',
        expandUnderCondition: 'newAddress',
        keepInPageOnReview: true,
      },
    },
    typeOfNewAddressUI: {
      'ui:title': 'Is this a permanent or temporary address?',
      'ui:widget': 'radio',
      'ui:options': {
        expandUnder: 'selectedAddress',
        expandUnderCondition: 'newAddress',
        hideIf: showNewAddressForm,
        hideOnReview: true,
      },
      'ui:required': !showNewAddressForm,
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
      'ui:description': OrderSupplyPageContent,
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
      'ui:description': OrderAccessoriesPageContent,
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
