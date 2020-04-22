// import fullSchema from 'vets-json-schema/dist/20-0996-schema.json';
import fullSchema from '../20-0996-schema.json';

// import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import {
  uiSchema as addressUISchema,
  schema as addressSchema,
} from 'platform/forms/definitions/address';

import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';
import { phoneEmailViewField } from '../../all-claims/content/contactInformation';
import {
  contactInfoDescription,
  contactInfoProfileLink,
} from '../content/contactInformation';

/*
import { errorMessages } from '../constants';

import { hasForwardingAddress, forwardingCountryIsUSA } from '../helpers';
import {
  ForwardingAddressViewField,
  ForwardingAddressDescription,
  forwardingAddressCheckboxLabel,
  ForwardingAddressReviewWidget,
} from '../content/ForwardingAddress';
import { checkDateRange } from '../validations';
import ForwardingAddressReviewField from '../containers/ForwardingAddressReviewField';
*/

const {
  // forwardingAddress,
  emailAddress,
  phone,
} = fullSchema.properties;

const contactInfo = {
  uiSchema: {
    'ui:title': 'Contact Information',
    'ui:description': contactInfoDescription,
    phoneEmailCard: {
      'ui:title': 'Phone & email',
      'ui:field': ReviewCardField,
      'ui:options': {
        viewComponent: phoneEmailViewField,
      },
      phone: phoneUI('Phone number'),
      emailAddress: emailUI(),
    },
    mailingAddress: {
      ...addressUISchema('Mailing address', true, () => true),
      'ui:field': ReviewCardField,
      'ui:options': {
        viewComponent: AddressViewField,
      },
      street: {
        'ui:title': 'Street address',
        'ui:errorMessages': {
          pattern: 'Please enter a valid street address',
          required: 'Please enter a street address',
        },
      },
      street2: {
        'ui:title': 'Line 2',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
      street3: {
        'ui:title': 'Line 3',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
    },
    /*
    'view:hasForwardingAddress': {
      'ui:title': forwardingAddressCheckboxLabel,
      'ui:field': 'StringField',
      'ui:widget': 'checkbox',
      'ui:reviewWidget': ForwardingAddressReviewWidget,
      'ui:reviewField': ForwardingAddressReviewField,
      'ui:options': {
        hideLabelText: true,
      },
    },
    forwardingAddress: merge(
      // update this to _not_ use 526's addressUISchema
      addressUISchema('forwardingAddress', 'Forwarding address', true),
      {
        'ui:order': [
          'effectiveDates',
          'country',
          'street',
          'street2',
          'city',
          'state',
          'postalCode',
        ],
        'ui:subtitle': ForwardingAddressDescription,
        'ui:options': {
          viewComponent: ForwardingAddressViewField,
          expandUnder: 'view:hasForwardingAddress',
        },
        effectiveDates: merge(
          {},
          dateRangeUI(
            'Start date',
            'End date',
            errorMessages.endDateBeforeStart,
          ),
          {
            from: {
              'ui:required': hasForwardingAddress,
              'ui:errorMessages': {
                required: errorMessages.forwardStartDate,
              },
            },
            'ui:validations': [checkDateRange],
          },
        ),
        country: {
          'ui:required': hasForwardingAddress,
        },
        street: {
          'ui:required': hasForwardingAddress,
        },
        city: {
          'ui:required': hasForwardingAddress,
        },
        state: {
          'ui:required': formData =>
            hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
        },
        postalCode: {
          'ui:required': formData =>
            hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
        },
      },
    ),
    */
    'view:contactInfoDescription': {
      'ui:description': contactInfoProfileLink,
    },
  },

  schema: {
    type: 'object',
    properties: {
      phoneEmailCard: {
        type: 'object',
        required: ['phone', 'emailAddress'],
        properties: {
          phone,
          emailAddress,
        },
      },
      mailingAddress: addressSchema(fullSchema, true, 'address'),
      /*
      'view:hasForwardingAddress': {
        type: 'boolean',
      },
      forwardingAddress,
      'view:contactInfoDescription': {
        type: 'object',
        properties: {},
      },
      */
      'view:contactInfoDescription': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default contactInfo;
