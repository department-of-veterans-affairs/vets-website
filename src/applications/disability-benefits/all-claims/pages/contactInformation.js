// import _ from '../../../../platform/utilities/data';
import _ from 'lodash';
import merge from 'lodash/merge';
import fullSchema from '../config/schema';
import dateUI from 'us-forms-system/lib/js/definitions/date';
import PhoneNumberWidget from 'us-forms-system/lib/js/widgets/PhoneNumberWidget';

import ReviewCardField from '../components/ReviewCardField';

import {
  PrimaryAddressViewField,
  ForwardingAddressViewField,
  contactInfoDescription,
  contactInfoUpdateHelp,
  phoneEmailViewField,
} from '../content/contactInformation';

import {
  validateZIP,
  validateMilitaryCity,
  validateMilitaryState,
} from '../validations';

import { hasForwardingAddress, forwardingCountryIsUSA } from '../utils';

import {
  ADDRESS_TYPES,
  MILITARY_CITIES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  STATE_LABELS,
  STATE_VALUES,
  USA,
} from '../constants';

/**
 *
 * @param {('addressCard.mailingAddress' | 'forwardingCard.forwardingAddress')} addressPath used for path lookups
 * @param {string} [title] Displayed as the card title in the card's header
 * @returns {object} UI schema for an address card's content
 */
const addressUISchema = (addressType, title) => {
  const updateStates = form => {
    const currentCity = _.get(form, `${addressType}.city`, '')
      .trim()
      .toUpperCase();
    if (MILITARY_CITIES.includes(currentCity)) {
      return {
        enum: MILITARY_STATE_VALUES,
        enumNames: MILITARY_STATE_LABELS,
      };
    }

    return {
      enum: STATE_VALUES,
      enumNames: STATE_LABELS,
    };
  };

  return {
    'ui:order': [
      'country',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'state',
      'zipCode',
    ],
    'ui:title': title,
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PrimaryAddressViewField,
    },
    country: {
      'ui:title': 'Country',
    },
    addressLine1: {
      'ui:title': 'Street address',
      'ui:errorMessages': {
        pattern: 'Please fill in a valid address',
      },
    },
    addressLine2: {
      'ui:title': 'Street address (optional)',
      'ui:errorMessages': {
        pattern: 'Please fill in a valid address',
      },
    },
    addressLine3: {
      'ui:title': 'Street address (optional)',
      'ui:errorMessages': {
        pattern: 'Please fill in a valid address',
      },
    },
    city: {
      'ui:title': 'City',
      'ui:validations': [
        {
          options: { addressPath: addressType },
          validator: validateMilitaryCity,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please fill in a valid city',
      },
    },
    state: {
      'ui:title': 'State',
      'ui:required': formData =>
        _.get(formData, `${addressType}.country`, '') === USA,
      'ui:options': {
        hideIf: formData =>
          _.get(formData, `${addressType}.country`, '') !== USA,
        updateSchema: updateStates,
      },
      'ui:validations': [
        {
          options: { addressPath: addressType },
          validator: validateMilitaryState,
        },
      ],
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:validations': [validateZIP],
      'ui:required': formData =>
        _.get(formData, `${addressType}.country`, '') === USA,
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5- or 9-digit ZIP code (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: formData =>
          _.get(formData, `${addressType}.country`, '') !== USA,
      },
    },
  };
};

const {
  mailingAddress,
  forwardingAddress,
  emailAddress,
  primaryPhone,
} = fullSchema.properties;

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfoDescription,
  phoneEmailCard: {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: phoneEmailViewField,
    },
    primaryPhone: {
      'ui:title': 'Phone number',
      'ui:widget': PhoneNumberWidget,
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
    ADDRESS_TYPES.mailingAddress,
    'Mailing address',
  ),
  'view:hasForwardingAddress': {
    'ui:title':
      'I want to provide a forwarding address since my address will be changing soon.',
  },
  forwardingAddress: merge(
    addressUISchema(ADDRESS_TYPES.forwardingAddress, 'Forwarding address'),
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
      effectiveDate: merge({}, dateUI('Effective date'), {
        'ui:required': hasForwardingAddress,
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
};

export const schema = {
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
};
