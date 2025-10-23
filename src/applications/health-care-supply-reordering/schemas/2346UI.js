import { isValidEmail } from 'platform/forms/validations';
import fullSchema from 'vets-json-schema/dist/MDOT-schema.json';
import BatteriesAndAccessories from '../components/BatteriesAndAccessories';
import ReviewPageSupplies from '../components/ReviewPageSupplies';
import VeteranInfoBox from '../components/VeteranInfoBox';

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedUISchemas: {
    veteranInfoUI: {
      'ui:field': VeteranInfoBox,
      first: {
        'ui:title': 'First name',
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
      },
      last: {
        'ui:title': 'Last name',
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
      },
      middle: {
        'ui:title': 'Middle name',
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
        },
      },
    },
    emailUI: {
      'ui:title': 'Email address',
      'ui:description':
        "We'll send an order confirmation email with a tracking number to this email address.",
      'ui:widget': 'email',
      'ui:errorMessages': {
        pattern: 'Please enter an email address using this format: X@X.com',
        required: 'Please enter an email address',
      },
      'ui:options': {
        classNames: 'vads-u-margin-bottom--3',
        widgetClassNames: 'va-input-large',
        inputType: 'email',
        useDlWrap: true,
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
    suppliesUI: {
      'ui:title': 'Select the hearing aid batteries and accessories you need.',
      'ui:description':
        'You can only order each hearing aid battery and accessory once every 5 months.',
      'ui:field': 'StringField',
      'ui:widget': BatteriesAndAccessories,
      'ui:reviewWidget': ReviewPageSupplies,
      'ui:options': {
        keepInPageOnReview: true,
      },
    },
  },
};
