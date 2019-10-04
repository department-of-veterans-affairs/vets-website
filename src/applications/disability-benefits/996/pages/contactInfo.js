import _ from 'lodash';

// import fullSchema from 'vets-json-schema/dist/20-0996-schema.json';
import fullSchema from '../20-0996-schema.json';

import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

import ReviewCardField from '../../all-claims/components/ReviewCardField';
import { ForwardingAddressViewField } from '../helpers';
import { isInPast } from '../validations';

import {
  contactInfoDescription,
  contactInfoUpdateHelp,
  phoneEmailViewField,
} from '../../all-claims/content/contactInformation';
import { USA } from '../../all-claims/constants';
import { addressUISchema } from '../../all-claims/utils';

import ForwardingAddressDescription from '../components/ForwardingAddressDescription';

const hasForwardingAddress = formData =>
  _.get(formData, 'veteran[view:hasForwardingAddress]', false);
const forwardingCountryIsUSA = formData =>
  _.get(formData, 'veteran.forwardingAddress.country', '') === USA;

const {
  mailingAddress,
  forwardingAddress,
  emailAddress,
  phone,
} = fullSchema.properties.veteran.properties;

export const uiSchema = {
  veteran: {
    'ui:title': 'Contact Information',
    'ui:description': contactInfoDescription,
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
          pattern: 'Phone numbers must be 10 digits (dashes allowed)',
        },
        'ui:options': {
          widgetClassNames: 'va-input-medium-large',
        },
      },
      emailAddress: {
        'ui:title': 'Email address',
        'ui:errorMessages': {
          pattern: 'The email you enter should be in this format x@x.xx',
        },
      },
    },
    mailingAddress: addressUISchema(
      'veteran.mailingAddress',
      'Mailing address',
      true,
    ),
    'view:hasForwardingAddress': {
      'ui:title': 'My address will be changing soon.',
    },
    forwardingAddress: _.merge(
      addressUISchema('veteran.forwardingAddress', 'Forwarding address'),
      {
        'ui:order': [
          'dateRange',
          'country',
          'addressLine1',
          'addressLine2',
          'addressLine3',
          'city',
          'state',
          'zipCode',
        ],
        'ui:description': ForwardingAddressDescription,
        'ui:options': {
          viewComponent: ForwardingAddressViewField,
          expandUnder: 'view:hasForwardingAddress',
        },
        dateRange: _.merge(
          {},
          dateRangeUI(
            'Start date',
            'End date',
            'End date must be after start date',
          ),
          {
            to: {
              'ui:validations': [isInPast],
            },
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
    'view:contactInfoDescription': {
      'ui:description': contactInfoUpdateHelp,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    veteran: {
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
  },
};
