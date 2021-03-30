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
            services,{' '}
            <a href="https://va.gov/profile">go to your VA.gov profile</a>. Or{' '}
            <a href="https://www.va.gov/resources/change-your-address-on-file-with-va/">
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
      countryName: {
        'ui:title': 'Country',
        'ui:options': {
          classNames: 'input-size-7',
          updateSchema: (formData, schema, uiSchemaCountry) => {
            const uiSchemaDisabled = uiSchemaCountry;

            if (formData.personalData.address.livesOutsideUS) {
              const formDataMailingAddress = formData.personalData.address;
              formDataMailingAddress.countryName = 'United States';
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
        'ui:title': 'Street address line 2',
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
      stateCode: {
        'ui:title': 'State',
        'ui:options': {
          classNames: 'input-size-7',
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
          pattern: 'Please enter a valid state',
          required: 'Please enter a state',
        },
      },
      zipCode: {
        'ui:title': 'Zip code',
        'ui:validations': [validateZIP],
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
    telephoneNumber: {
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
      'ui:description': (
        <p className="formfield-subtitle">
          To receive a confirmation email when you submit your request, you must
          re-enter your email address.
        </p>
      ),
      'ui:options': {
        classNames: 'input-size-7',
        hideOnReview: true,
      },
      'ui:validations': [
        {
          validator: (errors, fieldData, formData) => {
            const { primaryEmail, confirmationEmail } = formData.personalData;
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
    personalData: {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          required: [
            'countryName',
            'addressLine1',
            'city',
            'stateCode',
            'zipCode',
          ],
          properties: {
            livesOutsideUS: {
              type: 'boolean',
            },
            livesOnMilitaryBaseInfo: {
              type: 'object',
              properties: {},
            },
            countryName: {
              type: 'string',
            },
            addressLine1: SCHEMA_DEFINITIONS.address,
            addressLine2: SCHEMA_DEFINITIONS.address,
            city: SCHEMA_DEFINITIONS.city,
            stateCode: {
              type: 'string',
            },
            zipCode: SCHEMA_DEFINITIONS.zipCode,
          },
        },
        telephoneNumber: SCHEMA_DEFINITIONS.telephoneNumber,
        primaryEmail: SCHEMA_DEFINITIONS.emailAddress,
        confirmationEmail: SCHEMA_DEFINITIONS.emailAddress,
      },
    },
  },
};
