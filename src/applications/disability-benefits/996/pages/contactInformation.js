import merge from 'lodash/merge';

// import fullSchema from 'vets-json-schema/dist/20-0996-schema.json';
import fullSchema from '../20-0996-schema.json';

import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

import ReviewCardField from '../../all-claims/components/ReviewCardField';
import { addressUISchema } from '../../all-claims/utils';
import {
  contactInfoDescription,
  contactInfoUpdateHelp,
  phoneEmailViewField,
} from '../../all-claims/content/contactInformation';

import { hasForwardingAddress, forwardingCountryIsUSA } from '../helpers';
import {
  ForwardingAddressViewField,
  ForwardingAddressDescription,
  forwardingAddressCheckboxLabel,
} from '../content/ForwardingAddress';
import { checkDateRange } from '../validations';
import { errorMessages } from '../constants';

const {
  mailingAddress,
  forwardingAddress,
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
      phone: {
        'ui:title': 'Phone number',
        'ui:widget': PhoneNumberWidget,
        'ui:reviewWidget': PhoneNumberReviewWidget,
        'ui:errorMessages': {
          pattern: errorMessages.phone,
          required: errorMessages.phone,
        },
        'ui:options': {
          widgetClassNames: 'va-input-medium-large',
          inputType: 'tel',
        },
      },
      emailAddress: {
        'ui:title': 'Email address',
        'ui:errorMessages': {
          pattern: errorMessages.email,
          required: errorMessages.email,
        },
        'ui:options': {
          inputType: 'email',
        },
      },
    },
    mailingAddress: merge(
      addressUISchema('mailingAddress', 'Mailing address', true),
      {
        addressLine1: {
          'ui:errorMessages': {
            pattern: errorMessages.address1,
            required: errorMessages.address1,
          },
        },
        city: {
          'ui:errorMessages': {
            pattern: errorMessages.city,
            required: errorMessages.city,
          },
        },
        state: {
          'ui:errorMessages': {
            pattern: errorMessages.state,
            required: errorMessages.state,
          },
        },
        zipCode: {
          'ui:errorMessages': {
            pattern: errorMessages.zipCode,
            required: errorMessages.zipCode,
          },
        },
      },
    ),
    'view:hasForwardingAddress': {
      'ui:title': forwardingAddressCheckboxLabel,
    },
    forwardingAddress: merge(
      addressUISchema('forwardingAddress', 'Forwarding address', true),
      {
        'ui:order': [
          'effectiveDates',
          'country',
          'addressLine1',
          'addressLine2',
          'addressLine3',
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
          'ui:errorMessages': {
            pattern: errorMessages.address1,
            required: errorMessages.address1,
          },
        },
        city: {
          'ui:required': hasForwardingAddress,
          'ui:errorMessages': {
            pattern: errorMessages.city,
            required: errorMessages.city,
          },
        },
        state: {
          'ui:required': formData =>
            hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
          'ui:errorMessages': {
            pattern: errorMessages.state,
            required: errorMessages.state,
          },
        },
        zipCode: {
          'ui:required': formData =>
            hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
          'ui:errorMessages': {
            pattern: errorMessages.zipCode,
            required: errorMessages.zipCode,
          },
        },
      },
    ),
    'view:contactInfoDescription': {
      'ui:description': contactInfoUpdateHelp,
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
      'view:hasForwardingAddress': {
        type: 'boolean',
      },
      forwardingAddress,
      'view:contactInfoDescription': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default contactInfo;
