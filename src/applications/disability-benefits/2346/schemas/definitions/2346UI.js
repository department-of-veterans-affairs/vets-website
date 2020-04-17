import React from 'react';
import OrderAccessoriesPageContent from '../../components/OrderAccessoriesPageContent';
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

const addBatteriesUITitle = (
  <h4 className="vads-u-display--inline ">Add batteries to your order</h4>
);

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    currentAddressUI: {
      'ui:widget': 'radio',
      'ui:title': 'Shipping Address',
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
        expandUnder: 'currentAddress',
        expandUnderCondition: 'newAddress',
        keepInPageOnReview: true,
      },
    },
    selectedAddressUI: {
      'ui:title': 'Is this a permanent or temporary address?',
      'ui:widget': 'radio',
      'ui:options': {
        // expandUnder: 'newAddress',
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
      'ui:title': addBatteriesUITitle,
      'ui:description': 'Do you need to order hearing aid batteries?',
      'ui:widget': 'radio',
      'ui:required': () => true,
      'ui:options': {
        labels: {
          yes: 'Yes, I need batteries.',
          no: "No, I don't need batteries.",
        },
        hideOnReview: true,
      },
    },
    batteriesUI: {
      'ui:field': SelectArrayItemsBatteriesWidget,
      'ui:options': {
        expandUnder: viewAddBatteriesField,
        expandUnderCondition: 'yes',
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
