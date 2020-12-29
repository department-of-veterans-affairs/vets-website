import React from 'react';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import ContactInfoCard from '../../components/ContactInfoCard';

import {
  COUNTRY_CODES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_CODES,
  MILITARY_CITY_CODES,
  STATE_LABELS,
  STATE_VALUES,
} from '../../constants';

import {
  validateMilitaryCity,
  validateMilitaryState,
  validateZIP,
} from '../../utils/validations';

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description':
    'This is the contact information we have on file for you. Please verify that this information is correct.',
  'ui:options': {
    classNames: 'contact-info',
  },
  mailingAddress: {
    'ui:title': 'Edit mailing address',
    'ui:subtitle': (
      <>
        <p>
          Any updates you make here to your address will apply only to this
          application.
        </p>
        <p>
          To update your address for all of your VA accounts, you’ll need to go
          to your profile page.{' '}
          <a href="https://va.gov/profile">
            View the address that's on file in your profile.
          </a>
        </p>
      </>
    ),

    // TODO: startInEdit
    // - find a way to render ContactInfoCard on mount
    // - onClick edit mailing address should open ReviewCardField
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: ContactInfoCard,
      startInEdit: false,
    },

    livesOnMilitaryBase: {
      'ui:title':
        'I live on a United States military base outside of the United States',
    },
    livesOnMilitaryBaseInfo: {
      'ui:description': () => (
        <div className="vads-u-padding-x--2p5">
          <AdditionalInfo
            status="info"
            triggerText="Learn more about military base addresses"
          >
            <span>
              The United States is automatically chosen as your country if you
              live on a military base outside of the country.
            </span>
          </AdditionalInfo>
        </div>
      ),
    },
    country: {
      'ui:title': 'Country',
      'ui:options': {
        classNames: 'input-size-7',
        updateSchema: (formData, schema, uiSchemaCountry) => {
          const uiSchemaDisabled = uiSchemaCountry;

          if (formData.mailingAddress.livesOnMilitaryBase) {
            const formDataMailingAddress = formData.mailingAddress;
            formDataMailingAddress.country = 'United States';
            uiSchemaDisabled['ui:disabled'] = true;

            return {
              enum: ['United States'],
            };
          }
          uiSchemaDisabled['ui:disabled'] = false;
          return {
            enum: COUNTRY_CODES,
          };
        },
      },
    },
    addressLine1: {
      'ui:title': 'Street address',
      'ui:errorMessages': {
        required: 'Please enter a street address',
      },
      'ui:options': {
        classNames: 'input-size-7',
      },
    },
    addressLine2: {
      'ui:title': 'Line 2',
      'ui:options': {
        classNames: 'input-size-7',
      },
    },
    city: {
      'ui:errorMessages': {
        pattern: 'Please enter a valid city',
        required: 'Please enter a city',
      },
      'ui:options': {
        classNames: 'input-size-7',
        replaceSchema: formData => {
          if (formData.mailingAddress.livesOnMilitaryBase === true) {
            return {
              type: 'string',
              title: 'APO/FPO/DPO',
              enum: MILITARY_CITY_CODES,
            };
          }
          return {
            title: 'City',
            type: 'string',
            maxLength: 30,
            pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$",
          };
        },
      },
      'ui:validations': [
        {
          options: { addressPath: 'mailingAddress' },
          validator: validateMilitaryCity,
        },
      ],
    },
    state: {
      'ui:title': 'State',
      'ui:options': {
        classNames: 'input-size-7',
        hideIf: formData => formData.mailingAddress.livesOnMilitaryBase,
        updateSchema: formData => {
          if (
            formData.mailingAddress.livesOnMilitaryBase ||
            MILITARY_CITY_CODES.includes(formData.mailingAddress.city)
          ) {
            return {
              enum: MILITARY_STATE_CODES,
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
        formData.mailingAddress.livesOnMilitaryBase ||
        formData.mailingAddress.country === 'United States',
      'ui:validations': [
        {
          options: { addressPath: 'mailingAddress' },
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
      'ui:validations': [validateZIP],
      'ui:required': formData =>
        formData.mailingAddress.livesOnMilitaryBase ||
        formData.mailingAddress.country === 'United States',
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        hideIf: formData => formData.mailingAddress.livesOnMilitaryBase,
        classNames: 'input-size-2',
      },
    },
  },
  'view:contactInfoDescription': {
    'ui:description':
      "We'll contact you about your request with the phone number and email address below.",
  },
};

export const schema = {
  type: 'object',
  properties: {
    mailingAddress: {
      type: 'object',
      required: ['country', 'city', 'addressLine1'],
      properties: {
        livesOnMilitaryBase: {
          type: 'boolean',
        },
        livesOnMilitaryBaseInfo: {
          type: 'object',
          properties: {},
        },
        country: {
          type: 'string',
        },
        addressLine1: {
          type: 'string',
          maxLength: 20,
          pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
        },
        addressLine2: {
          type: 'string',
          maxLength: 20,
          pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
        },
        city: {
          type: 'string',
          maxLength: 30,
          pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$",
        },
        state: {
          type: 'string',
        },
        zipCode: {
          type: 'string',
          pattern: '^\\d{5}(?:([-\\s]?)\\d{4})?$',
        },
      },
    },
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
