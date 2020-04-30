import { isValidEmail } from 'platform/forms/validations';
import React from 'react';
import AddressViewField from '../../components/AddressViewField';
import ReviewCardField from '../../components/ReviewCardField';
import ReviewPageBatteries from '../../components/ReviewPageBatteries';
import ReviewPageAccessories from '../../components/ReviewPageAccessories';
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

const addBatteriesUITitle = (
  <h4 className="vads-u-display--inline ">Add batteries to your order</h4>
);

const addAccessoriesUITitle = (
  <h4 className="vads-u-display--inline">
    Add hearing aid accessories to your order
  </h4>
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
        hideOnReview: formData =>
          formData.currentAddress !== 'permanentAddress',
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
        hideOnReview: formData =>
          formData.currentAddress !== 'temporaryAddress',
      },
    },
    currentAddressUI: {
      'ui:options': {
        classNames: 'vads-u-display--none',
        hideOnReview: true,
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
        hideOnReview: true,
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
      'ui:title': addBatteriesUITitle,
      'ui:description': 'Do you need to order hearing aid batteries?',
      'ui:widget': 'radio',
      'ui:required': () => true,
      'ui:options': {
        labels: {
          yes: 'Yes, I need batteries.',
          no: "No, I don't need batteries.",
        },
        classNames: 'product-selection-radio-btns',
      },
    },
    batteriesUI: {
      'ui:title': ' ',
      'ui:field': 'StringField',
      'ui:widget': SelectArrayItemsBatteriesWidget,
      'ui:reviewWidget': ReviewPageBatteries,
      'ui:options': {
        keepInPageOnReview: true,
        expandUnder: viewAddBatteriesField,
        expandUnderCondition: 'yes',
      },
    },
    addAccessoriesUI: {
      'ui:title': addAccessoriesUITitle,
      'ui:description': ' Do you need to order hearing aid accessories?',
      'ui:required': () => true,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes, I need accessories.',
          no: "No, I don't need accessories.",
        },
        classNames: 'product-selection-radio-btns',
      },
    },
    accessoriesUI: {
      'ui:title': ' ',
      'ui:field': 'StringField',
      'ui:description':
        'You will be sent a 6 month supply of batteries for each device you select below.',
      'ui:widget': SelectArrayItemsAccessoriesWidget,
      'ui:reviewWidget': ReviewPageAccessories,
      'ui:options': {
        keepInPageOnReview: true,
        expandUnder: viewAddAccessoriesField,
        expandUnderCondition: 'yes',
      },
    },
  },
};
