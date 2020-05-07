import { isValidEmail } from 'platform/forms/validations';
import React from 'react';
import AddressViewField from '../../components/AddressViewField';
import ReviewCardField from '../../components/ReviewCardField';
import ReviewPageAccessories from '../../components/ReviewPageAccessories';
import ReviewPageBatteries from '../../components/ReviewPageBatteries';
import SelectArrayItemsAccessoriesWidget from '../../components/SelectArrayItemsAccessoriesWidget';
import SelectArrayItemsBatteriesWidget from '../../components/SelectArrayItemsBatteriesWidget';
import { schemaFields } from '../../constants';
import fullSchema from '../2346-schema.json';
import { addressUISchema } from '../address-schema';

const { permAddressField, tempAddressField } = schemaFields;

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

const addressDescription = (
  <>
    <p>
      Any updates you make here to your address will apply only to this
      application.
    </p>
    <p>
      To update your address for all of your VA accounts, you’ll need to go to
      your profile page.{' '}
      <a href="va.gov/profile">
        View the address that's on file in your profile.
      </a>
    </p>
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
      'ui:subtitle': addressDescription,
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
      'ui:subtitle': addressDescription,
      'ui:field': ReviewCardField,
      'ui:options': {
        viewComponent: AddressViewField,
        startInEdit: formData =>
          Object.values(formData).every(prop => Boolean(prop)),
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
    batteriesUI: {
      'ui:field': 'StringField',
      'ui:widget': SelectArrayItemsBatteriesWidget,
      'ui:reviewWidget': ReviewPageBatteries,
      'ui:options': {
        keepInPageOnReview: true,
      },
    },
    accessoriesUI: {
      'ui:title': 'Select the hearing aid accessories you need.',
      'ui:description':
        'You can only order each hearing aid accessory once every 5 months.',
      'ui:field': 'StringField',
      'ui:widget': SelectArrayItemsAccessoriesWidget,
      'ui:reviewWidget': ReviewPageAccessories,
      'ui:options': {
        keepInPageOnReview: true,
      },
    },
  },
};
