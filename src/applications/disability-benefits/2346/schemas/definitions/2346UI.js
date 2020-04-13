import { isValidEmail } from 'platform/forms/validations';
import React from 'react';
import OrderAccessoriesPageContent from '../../components/OrderAccessoriesPageContent';
import OrderSupplyPageContent from '../../components/OrderSupplyPageContent';
import SelectArrayItemsAccessoriesWidget from '../../components/SelectArrayItemsAccessoriesWidget';
import SelectArrayItemsBatteriesWidget from '../../components/SelectArrayItemsBatteriesWidget';
import { schemaFields } from '../../constants';
import { getRadioLabelText, showNewAddressForm } from '../../helpers';
import fullSchema from '../2346-schema.json';
import { addressUISchema } from '../address-schema';

const {
  viewAddAccessoriesField,
  viewAddBatteriesField,
  newAddressField,
} = schemaFields;

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

const selectedAddressUITitle = (
  <h4 className="vads-u-display--inline">Shipping address</h4>
);

const selectedAddressUIDescription = (
  <>
    <br />
    <p className="vads-u-display--inline">
      We'll ship your order to the address below. Orders typically arrive within
      7 to 10 business days.
    </p>
    <br />
    <p className="vads-u-font-weight--bold">
      Select the address where you'd like to send your order:
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
      'ui:title': selectedAddressUITitle,
      'ui:description': selectedAddressUIDescription,
      'ui:widget': 'radio',
      'ui:options': {
        updateSchema: formData => {
          const updatedEnumNames = ['permanentAddress', 'temporaryAddress'].map(
            address => getRadioLabelText(formData, address),
          );
          return {
            enumNames: [...updatedEnumNames, 'Add new address'],
            enum: ['permanentAddress', 'temporaryAddress', newAddressField],
          };
        },
      },
      'ui:required': () => true,
    },
    newAddressUI: {
      ...addressUISchema(
        true,
        newAddressField,
        formData => formData.selectedAddress === newAddressField,
      ),
      'ui:title': 'Add a new shipping address',
      'ui:options': {
        expandUnder: 'selectedAddress',
        expandUnderCondition: newAddressField,
        keepInPageOnReview: true,
        classNames: 'vads-u-margin-top--2',
      },
    },
    typeOfNewAddressUI: {
      'ui:title': 'Is this a permanent or temporary address?',
      'ui:widget': 'radio',
      'ui:options': {
        expandUnder: 'selectedAddress',
        expandUnderCondition: newAddressField,
        hideIf: formData => !showNewAddressForm(formData),
        hideOnReview: true,
      },
      'ui:required': formData => showNewAddressForm(formData),
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
        classNames: 'vads-u-margin-bottom--3',
        widgetClassNames: 'va-input-large',
        inputType: 'email',
      },
      'ui:validations': [
        {
          validator: (errors, fieldData) => {
            const isEmailValid = isValidEmail(fieldData);
            if (!isEmailValid) {
              errors.addError('Please enter a valid email');
            }
          },
        },
      ],
    },
    confirmationEmailUI: {
      'ui:title': 'Re-enter email address',
      'ui:widget': 'email',
      'ui:errorMessages': {
        pattern: 'Please enter an email address using this format: X@X.com',
        required: 'Please enter an email address',
      },
      'ui:options': {
        widgetClassNames: 'va-input-large',
        inputType: 'email',
      },
      'ui:validations': [
        {
          validator: (errors, fieldData, formData) => {
            const emailMatcher = () => formData.email === fieldData;
            const doesEmailMatch = emailMatcher();
            if (!doesEmailMatch) {
              errors.addError(
                'This email does not match your previously entered email',
              );
            }
          },
        },
      ],
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
