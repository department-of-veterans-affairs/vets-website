// import fullSchema from 'vets-json-schema/dist/20-0996-schema.json';
import fullSchema from '../20-0996-schema.json';

// import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import ReviewCardField from '../../all-claims/components/ReviewCardField';
import { addressUISchema } from '../../all-claims/utils';
import {
  contactInfoDescription,
  phoneEmailViewField,
} from '../../all-claims/content/contactInformation';
import { contactInfoProfileLink } from '../content/contactInformation';

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
  mailingAddress,
  // forwardingAddress,
  emailAddress,
  phone,
} = fullSchema.properties;

const contactInfo = {
  uiSchema: {
    'ui:title': 'Contact Information',
    'ui:description': () =>
      contactInfoDescription({
        formName: 'Higher-Level Review',
      }),
    phoneEmailCard: {
      'ui:title': 'Phone & email',
      'ui:field': ReviewCardField,
      'ui:options': {
        viewComponent: phoneEmailViewField,
      },
      phone: phoneUI('Phone number'),
      emailAddress: emailUI(),
    },
    mailingAddress: addressUISchema('mailingAddress', 'Mailing address', true),
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
      addressUISchema('forwardingAddress', 'Forwarding address', true),
      {
        'ui:order': [
          'effectiveDates',
          'country',
          'addressLine1',
          'addressLine2',
          'city',
          'state',
          'zipCode',
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
        addressLine1: {
          'ui:required': hasForwardingAddress,
        },
        city: {
          'ui:required': hasForwardingAddress,
        },
        state: {
          'ui:required': formData =>
            hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
        },
        zipCode: {
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
      mailingAddress,
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
