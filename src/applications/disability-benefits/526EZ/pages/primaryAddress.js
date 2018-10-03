import _ from 'lodash';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
// import fullSchema526EZ from '/path/vets-json-schema/dist/21-526EZ-schema.json';

import dateUI from 'us-forms-system/lib/js/definitions/date';
import PhoneNumberWidget from 'us-forms-system/lib/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'us-forms-system/lib/js/review/PhoneNumberWidget';

import ReviewCardField from '../../all-claims/components/ReviewCardField';

import {
  PrimaryAddressViewField,
  ForwardingAddressViewField,
  contactInfoDescription,
  contactInfoUpdateHelp,
  phoneEmailViewField,
} from '../../all-claims/content/contactInformation';
import {
  ADDRESS_TYPES,
  MILITARY_CITIES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  STATE_LABELS,
  STATE_VALUES,
  USA,
} from '../../all-claims/constants';

// These validators are staying in the increase-only form because most of them
// rely on the data structure of the increase-only form. The all-claims form
// has a different structure so it's easier to just keep the validations separate
// and delete these when the time comes
function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}

function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError('Please enter a valid 9 digit ZIP (dashes allowed)');
  }
}

function validateMilitaryCity(
  errors,
  city,
  formData,
  schema,
  messages,
  options,
) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    _.get(formData, `veteran.${options.addressPath}.state`, ''),
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
}

function validateMilitaryState(
  errors,
  state,
  formData,
  schema,
  messages,
  options,
) {
  const isMilitaryCity = MILITARY_CITIES.includes(
    _.get(formData, `veteran.${options.addressPath}.city`, '')
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

const hasForwardingAddress = formData =>
  _.get(formData, 'veteran[view:hasForwardingAddress]', false);
const forwardingCountryIsUSA = formData =>
  _.get(formData, 'veteran.forwardingAddress.country', '') === USA;

/**
 *
 * @param {('addressCard.mailingAddress' | 'forwardingCard.forwardingAddress')} addressPath used for path lookups
 * @param {string} [title] Displayed as the card title in the card's header
 * @returns {object} UI schema for an address card's content
 */
const addressUISchema = (addressType, title) => {
  const updateStates = form => {
    const currentCity = _.get(form, `veteran.${addressType}.city`, '')
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
      'ui:required': ({ veteran }) =>
        _.get(veteran, `${addressType}.country`, '') === USA,
      'ui:options': {
        hideIf: ({ veteran }) =>
          _.get(veteran, `${addressType}.country`, '') !== USA,
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
      'ui:required': ({ veteran }) =>
        _.get(veteran, `${addressType}.country`, '') === USA,
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5- or 9-digit ZIP code (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: ({ veteran }) =>
          _.get(veteran, `${addressType}.country`, '') !== USA,
      },
    },
  };
};

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
      primaryPhone: {
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
      ADDRESS_TYPES.mailingAddress,
      'Mailing address',
    ),
    'view:hasForwardingAddress': {
      'ui:title':
        'I want to provide a forwarding address since my address will be changing soon.',
    },
    forwardingAddress: _.merge(
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
        effectiveDate: _.merge({}, dateUI('Effective date'), {
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
