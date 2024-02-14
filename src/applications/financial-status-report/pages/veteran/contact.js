import React from 'react';
import ReviewCardField from '../../components/shared/ReviewCardField';
import ContactInfoCard from '../../components/shared/ContactInfoCard';

import {
  SCHEMA_DEFINITIONS,
  COUNTRY_LABELS,
  COUNTRY_VALUES,
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
  validatePhone,
  validateEmail,
} from '../../utils/validations';

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': (
    <p>
      This is the contact information we have on file for you. We’ll send any
      information about your debt to this mailing address. Please review and
      make any needed edits. You can also add or change your phone number or
      email address.
    </p>
  ),
  'ui:options': {
    classNames: 'contact-info',
  },
  personalData: {
    address: {
      'ui:field': ReviewCardField,
      'ui:options': {
        editTitle: 'Edit mailing address',
        viewComponent: ContactInfoCard,
        startInEdit: false,
        hideOnReview: true,
      },
      'ui:subtitle': (
        <>
          <p>
            Any updates you make here will only change your mailing address for
            this request.
          </p>
          <p>
            If you want to change your address for other VA benefits and
            services,
            <a
              href="https://va.gov/profile"
              className="vads-u-margin-left--0p5"
            >
              go to your VA.gov profile
            </a>
            . Or
            <a
              href="https://www.va.gov/resources/change-your-address-on-file-with-va/"
              className="vads-u-margin-left--0p5"
            >
              find out how to change your address on file with VA
            </a>
            .
          </p>
        </>
      ),
      livesOutsideUS: {
        'ui:title': 'I live on a U.S. military base outside of the U.S.',
        'ui:options': {
          widgetClassNames: 'checkbox-group',
        },
      },
      livesOnMilitaryBaseInfo: {
        'ui:description': () => (
          <va-additional-info
            trigger="Learn more about military base addresses"
            uswds
          >
            <span>
              The United States is automatically chosen as your country if you
              live on a military base outside of the country.
            </span>
          </va-additional-info>
        ),
      },
      country: {
        'ui:title': 'Country',
        'ui:options': {
          widgetClassNames: 'input-size-7',
          updateSchema: (formData, schema, uiSchemaCountry) => {
            const uiSchemaDisabled = uiSchemaCountry;
            uiSchemaDisabled['ui:disabled'] = false;
            const { address } = formData.personalData;

            if (address.livesOutsideUS) {
              address.country = 'USA';
              uiSchemaDisabled['ui:disabled'] = true;
              return {
                enumNames: ['United States'],
                enum: ['USA'],
              };
            }
            return {
              enumNames: COUNTRY_LABELS,
              enum: COUNTRY_VALUES,
            };
          },
        },
        'ui:errorMessages': {
          enum: 'Please select a country.',
        },
      },
      street: {
        'ui:title': 'Street address',
        'ui:errorMessages': {
          pattern: 'Please enter a street address.',
        },
        'ui:options': {
          widgetClassNames: 'input-size-7',
        },
      },
      street2: {
        'ui:title': 'Street address line 2',
        'ui:options': {
          widgetClassNames: 'input-size-7',
        },
      },
      city: {
        'ui:errorMessages': {
          pattern: 'Please enter a valid city.',
          required: 'Please enter a city.',
        },
        'ui:options': {
          widgetClassNames: 'input-size-7',
          replaceSchema: formData => {
            if (formData.personalData.address.livesOutsideUS) {
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
            options: { addressPath: 'address' },
            validator: validateMilitaryCity,
          },
        ],
      },
      state: {
        'ui:title': 'State',
        'ui:options': {
          widgetClassNames: 'input-size-7',
          updateSchema: formData => {
            if (
              formData.personalData.address.livesOutsideUS ||
              MILITARY_CITY_CODES.includes(formData.personalData.address.city)
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
        'ui:validations': [
          {
            options: { addressPath: 'address' },
            validator: validateMilitaryState,
          },
        ],
        'ui:errorMessages': {
          enum: 'Please select a state.',
        },
      },
      postalCode: {
        'ui:title': 'Postal code',
        'ui:validations': [validateZIP],
        'ui:errorMessages': {
          required: 'Please enter a postal code.',
          pattern: 'Please enter a valid postal code.',
        },
        'ui:options': {
          widgetClassNames: 'input-size-5',
        },
      },
    },
    telephoneNumber: {
      'ui:title': 'Phone number',
      'ui:validations': [validatePhone],
      'ui:options': {
        widgetClassNames: 'input-size-7',
      },
    },
    emailAddress: {
      'ui:title': 'Email address',
      'ui:validations': [validateEmail],
      'ui:options': {
        widgetClassNames: 'input-size-7',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          required: ['country', 'street', 'city', 'state', 'postalCode'],
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
            street: SCHEMA_DEFINITIONS.address,
            street2: SCHEMA_DEFINITIONS.address,
            city: SCHEMA_DEFINITIONS.city,
            state: {
              type: 'string',
            },
            postalCode: SCHEMA_DEFINITIONS.postalCode,
          },
        },
        telephoneNumber: {
          type: 'string',
        },
        emailAddress: {
          type: 'string',
        },
      },
    },
  },
};
