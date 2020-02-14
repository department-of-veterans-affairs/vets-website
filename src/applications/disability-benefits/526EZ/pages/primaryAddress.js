import _ from 'lodash';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
// import fullSchema526EZ from '/path/vets-json-schema/dist/21-526EZ-schema.json';

import dateUI from 'platform/forms-system/src/js/definitions/date';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import ReviewCardField from '../../all-claims/components/ReviewCardField';
import { ForwardingAddressViewField } from '../helpers';

import {
  contactInfoDescription,
  contactInfoUpdateHelp,
  phoneEmailViewField,
} from '../../all-claims/content/contactInformation';
import { USA } from '../../all-claims/constants';
import { addressUISchema } from '../../all-claims/utils';

const hasForwardingAddress = formData =>
  _.get(formData, 'veteran[view:hasForwardingAddress]', false);
const forwardingCountryIsUSA = formData =>
  _.get(formData, 'veteran.forwardingAddress.country', '') === USA;

const {
  mailingAddress,
  forwardingAddress,
  emailAddress,
  primaryPhone,
} = fullSchema526EZ.properties.veteran.properties;

export const uiSchema = {
  veteran: {
    'ui:description': contactInfoDescription,
    phoneEmailCard: {
      'ui:title': 'Phone & email',
      'ui:field': ReviewCardField,
      'ui:options': {
        viewComponent: phoneEmailViewField,
      },
      primaryPhone: phoneUI('Phone number'),
      emailAddress: emailUI(),
    },
    mailingAddress: addressUISchema(
      'veteran.mailingAddress',
      'Mailing address',
      true,
    ),
    'view:hasForwardingAddress': {
      'ui:title':
        'I want to provide a forwarding address since my address will be changing soon.',
    },
    forwardingAddress: _.merge(
      addressUISchema('veteran.forwardingAddress', 'Forwarding address'),
      {
        'ui:order': [
          'effectiveDate',
          'country',
          'addressLine1',
          'addressLine2',
          'addressLine3',
          'city',
          'state',
          'zipCode',
        ],
        'ui:options': {
          viewComponent: ForwardingAddressViewField,
          expandUnder: 'view:hasForwardingAddress',
        },
        effectiveDate: _.merge({}, dateUI('Effective date'), {
          'ui:required': hasForwardingAddress,
          'ui:errorMessages': {
            required: 'Please enter an effective date',
          },
        }),
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
          required: ['primaryPhone', 'emailAddress'],
          properties: {
            primaryPhone,
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
