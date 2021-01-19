import React from 'react';
import ReviewCardField from '../../components/ReviewCardField';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import ContactInfoCard from '../../components/ContactInfoCard';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import {
  SCHEMA_DEFINITIONS,
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
    'ui:subtitle': (
      <>
        <p>
          Any updates you make here to your address will apply only to this
          application.
        </p>
        <p>
          To update your address for all of your VA accounts, you’ll need to go
          to your profile page.{' '}
          <a
            className="vads-u-text-decoration--none"
            href="https://va.gov/profile"
          >
            View the address that's on file in your profile.
          </a>
        </p>
      </>
    ),
    'ui:field': ReviewCardField,
    'ui:options': {
      editTitle: 'Edit mailing address',
      viewComponent: ContactInfoCard,
      startInEdit: false,
    },
    livesOutsideUS: {
      'ui:title':
        'I live on a United States military base outside of the United States.',
      'ui:options': {
        widgetClassNames: 'checkbox-group',
      },
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

          if (formData.mailingAddress.livesOutsideUS) {
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
          if (formData.mailingAddress.livesOutsideUS) {
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
        updateSchema: formData => {
          if (
            formData.mailingAddress.livesOutsideUS ||
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
      // 'ui:required': formData => !formData.mailingAddress.livesOutsideUS,
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
      // 'ui:required': formData => !formData.mailingAddress.livesOutsideUS,
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        classNames: 'input-size-2',
      },
    },
  },
  contactInfo: {
    'ui:description':
      "We'll contact you about your request with the phone number and email address below.",
    phoneNumber: {
      ...phoneUI('Phone number'),
      'ui:options': {
        classNames: 'input-size-7',
      },
    },
    primaryEmail: {
      ...emailUI('Email address'),
      'ui:options': {
        classNames: 'input-size-7',
      },
    },
    confirmationEmail: {
      ...emailUI('Re-enter email address'),
      'ui:options': {
        classNames: 'input-size-7',
        hideOnReview: true,
      },
      'ui:validations': [
        {
          validator: (errors, fieldData, formData) => {
            const { primaryEmail, confirmationEmail } = formData.contactInfo;
            if (primaryEmail !== confirmationEmail) {
              errors.addError('Email does not match');
            }
          },
        },
      ],
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    mailingAddress: {
      type: 'object',
      // required: ['country', 'city', 'addressLine1'],
      properties: {
        livesOutsideUS: {
          type: 'boolean',
        },
        livesOnMilitaryBaseInfo: {
          type: 'object',
          properties: {},
        },
        country: {
          type: 'string',
        },
        addressLine1: SCHEMA_DEFINITIONS.address,
        addressLine2: SCHEMA_DEFINITIONS.address,
        city: SCHEMA_DEFINITIONS.city,
        state: {
          type: 'string',
        },
        zipCode: SCHEMA_DEFINITIONS.zipCode,
      },
    },
    contactInfo: {
      type: 'object',
      properties: {
        phoneNumber: SCHEMA_DEFINITIONS.phone,
        primaryEmail: SCHEMA_DEFINITIONS.email,
        confirmationEmail: SCHEMA_DEFINITIONS.email,
      },
    },
  },
};
