import React from 'react';
import merge from 'lodash/merge';
import omit from 'platform/utilities/data/omit';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';

import {
  contactInfoDescription,
  contactInfoUpdateHelpDescription,
  phoneEmailViewField,
} from '../content/contactInformation';

import { addressUISchema } from '../utils/schemas';

import {
  ADDRESS_PATHS,
  USA,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  MILITARY_CITIES,
  STATE_LABELS,
  STATE_VALUES,
} from '../constants';

import {
  validateMilitaryCity,
  validateMilitaryState,
  validateZIP,
} from '../validations';

const {
  // forwardingAddress,
  phoneAndEmail,
} = fullSchema.properties;

const mailingAddress = merge(
  {
    properties: {
      'view:livesOnMilitaryBase': {
        type: 'boolean',
      },
      'view:livesOnMilitaryBaseInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
  fullSchema.definitions.address,
);

const countryEnum = fullSchema.definitions.country.enum;
const citySchema = fullSchema.definitions.address.properties.city;

/**
 * Return state of mailing address military base checkbox
 * @param {object} data - Complete form data
 * @returns {boolean} - military base checkbox state
 */
const getMilitaryValue = data =>
  data.mailingAddress?.['view:livesOnMilitaryBase'];

// Temporary storage for city & state if military base checkbox is toggled more
// than once
const savedAddress = {
  city: '',
  state: '',
};

/**
 * Update form data to remove selected military city & state and restore any
 * previously set city & state when the "I live on a U.S. military base"
 * checkbox is unchecked. See va.gov-team/issues/42216 for details
 * @param {object} oldFormData - Form data prior to interaction change
 * @param {object} formData - Form data after interaction change
 * @returns {object} - updated Form data with manipulated mailing address if the
 * military base checkbox state changes
 */
export const updateFormData = (oldFormData, formData) => {
  let { city, state } = formData.mailingAddress;
  const onMilitaryBase = getMilitaryValue(formData);
  if (getMilitaryValue(oldFormData) !== onMilitaryBase) {
    if (onMilitaryBase) {
      savedAddress.city = oldFormData.mailingAddress.city || '';
      savedAddress.state = oldFormData.mailingAddress.state || '';
      city = '';
      state = '';
    } else {
      city = MILITARY_CITIES.includes(oldFormData.mailingAddress.city)
        ? savedAddress.city
        : city || savedAddress.city;
      state = MILITARY_STATE_VALUES.includes(oldFormData.mailingAddress.state)
        ? savedAddress.state
        : state || savedAddress.state;
    }
  }
  return {
    ...formData,
    mailingAddress: {
      ...formData.mailingAddress,
      city,
      state,
    },
  };
};

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfoDescription,
  phoneAndEmail: {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: phoneEmailViewField,
    },
    primaryPhone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  mailingAddress: {
    ...omit(
      ['ui:order'],
      addressUISchema(ADDRESS_PATHS.mailingAddress, 'Mailing address', true),
    ),
    'view:livesOnMilitaryBase': {
      'ui:title':
        'I live on a United States military base outside of the United States',
    },
    'view:livesOnMilitaryBaseInfo': {
      'ui:description': () => (
        <div className="vads-u-padding-x--2p5">
          <va-additional-info trigger="Learn more about military base addresses">
            <span>
              The United States is automatically chosen as your country if you
              live on a military base outside of the country.
            </span>
          </va-additional-info>
        </div>
      ),
    },
    country: {
      'ui:title': 'Country',
      'ui:autocomplete': 'country',
      'ui:options': {
        updateSchema: (formData, schema, uiSchemaCountry) => {
          const uiSchemaDisabled = uiSchemaCountry;

          if (formData.mailingAddress?.['view:livesOnMilitaryBase']) {
            const formDataMailingAddress = formData.mailingAddress;
            formDataMailingAddress.country = USA;

            uiSchemaDisabled['ui:disabled'] = true;

            return {
              enum: [USA],
            };
          }
          uiSchemaDisabled['ui:disabled'] = false;
          return {
            enum: countryEnum,
          };
        },
      },
    },
    addressLine1: {
      'ui:title': 'Street address (20 characters maximum)',
      'ui:autocomplete': 'address-line1',
      'ui:errorMessages': {
        required: 'Please enter a street address',
      },
    },
    addressLine2: {
      'ui:title': 'Street address line 2 (20 characters maximum)',
      'ui:autocomplete': 'address-line2',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
      },
    },
    addressLine3: {
      'ui:title': 'Street address line 3 (20 characters maximum)',
      'ui:autocomplete': 'address-line3',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
      },
    },
    city: {
      'ui:autocomplete': 'address-level2',
      'ui:errorMessages': {
        pattern: 'Please enter a valid city',
        required: 'Please enter a city',
      },
      'ui:options': {
        replaceSchema: formData => {
          if (formData.mailingAddress?.['view:livesOnMilitaryBase'] === true) {
            return {
              type: 'string',
              title: 'APO/FPO/DPO',
              enum: MILITARY_CITIES,
            };
          }
          return merge(
            {
              title: 'City',
            },
            citySchema,
          );
        },
      },
      'ui:validations': [
        {
          options: { addressPath: 'mailingAddress' },
          // pathWithIndex is called in validateMilitaryCity
          validator: validateMilitaryCity,
        },
      ],
    },
    state: {
      'ui:title': 'State',
      'ui:autocomplete': 'address-level1',
      'ui:options': {
        hideIf: formData =>
          !formData.mailingAddress?.['view:livesOnMilitaryBase'] &&
          formData.mailingAddress.country !== USA,
        updateSchema: formData => {
          if (
            formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
            MILITARY_CITIES.includes(formData.mailingAddress.city)
          ) {
            return {
              enum: MILITARY_STATE_VALUES,
              enumNames: MILITARY_STATE_LABELS,
            };
          }
          return {
            enum: STATE_VALUES,
            enumNames: STATE_LABELS,
          };
        },
      },
      'ui:required': formData =>
        formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
        formData.mailingAddress.country === USA,
      'ui:validations': [
        {
          options: { addressPath: 'mailingAddress' },
          // pathWithIndex is called in validateMilitaryState
          validator: validateMilitaryState,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please enter a valid state',
        required: 'Please enter a state',
      },
    },
    zipCode: {
      'ui:title': 'Postal code',
      'ui:autocomplete': 'postal-code',
      'ui:validations': [validateZIP],
      'ui:required': formData =>
        formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
        formData.mailingAddress.country === USA,
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: formData =>
          !formData.mailingAddress?.['view:livesOnMilitaryBase'] &&
          formData.mailingAddress.country !== USA,
      },
    },
  },
  'view:contactInfoDescription': {
    'ui:description': contactInfoUpdateHelpDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail,
    mailingAddress,
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
