import { isValidEmail } from 'platform/forms/validations';
import React from 'react';
import AddressViewField from '../../components/AddressViewField';
import OrderAccessoriesPageContent from '../../components/OrderAccessoriesPageContent';
import OrderSupplyPageContent from '../../components/OrderSupplyPageContent';
import ReviewCardField from '../../components/ReviewCardField';
import SelectArrayItemsAccessoriesWidget from '../../components/SelectArrayItemsAccessoriesWidget';
import SelectArrayItemsBatteriesWidget from '../../components/SelectArrayItemsBatteriesWidget';
import { schemaFields } from '../../constants';
import fullSchema from '../2346-schema.json';
import { addressUISchema } from '../address-schema';

const {
  viewAddAccessoriesField,
  viewAddBatteriesField,
  permAddressField,
  tempAddressField,
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

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    permanentAddressUI: {
      ...addressUISchema(
        true,
        permAddressField,
        formData => formData.permanentAddress,
      ),
      'ui:title': 'Permanent address',
      'ui:field': ReviewCardField,
      'ui:options': {
        viewComponent: AddressViewField,
      },
    },
    temporaryAddressUI: {
      ...addressUISchema(true, tempAddressField, formData => {
        const {
          street,
          city,
          state,
          country,
          postalCode,
          internationalPostalCode,
        } = formData.temporaryAddress;

        if (
          !street &&
          !city &&
          !state &&
          !country &&
          !postalCode &&
          !internationalPostalCode
        ) {
          return false;
        }
        return true;
      }),
      'ui:title': 'Temporary address',
      'ui:field': ReviewCardField,
      'ui:options': {
        viewComponent: AddressViewField,
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
