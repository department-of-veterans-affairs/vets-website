import React from 'react';
// import _ from 'platform/utilities/data';
import merge from 'lodash/merge';
import omit from 'platform/utilities/data/omit';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
// import dateUI from 'platform/forms-system/src/js/definitions/date';
// import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import {
  contactInfo,
  contactInfoUpdateHelp,
  // forwardingAddressDescription,
  // ForwardingAddressViewField,
  phoneEmailViewField,
} from '../content/contactInformation';

// import { isInFuture } from '../validations';

import {
  // hasForwardingAddress,
  // forwardingCountryIsUSA,
  addressUISchema,
} from '../utils';

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

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfo,
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
        updateSchema: (formData, schema, uiSchemaCountry) => {
          const uiSchemaDisabled = uiSchemaCountry;

          if (formData.mailingAddress['view:livesOnMilitaryBase']) {
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
      'ui:errorMessages': {
        required: 'Please enter a street address',
      },
    },
    addressLine2: {
      'ui:title': 'Street address (20 characters maximum)',
    },
    addressLine3: {
      'ui:title': 'Street address (20 characters maximum)',
    },
    city: {
      'ui:errorMessages': {
        pattern: 'Please enter a valid city',
        required: 'Please enter a city',
      },
      'ui:options': {
        replaceSchema: formData => {
          if (formData.mailingAddress['view:livesOnMilitaryBase'] === true) {
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
      'ui:options': {
        hideIf: formData =>
          !formData.mailingAddress['view:livesOnMilitaryBase'] &&
          formData.mailingAddress.country !== USA,
        updateSchema: formData => {
          if (
            formData.mailingAddress['view:livesOnMilitaryBase'] ||
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
        formData.mailingAddress['view:livesOnMilitaryBase'] ||
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
      'ui:validations': [validateZIP],
      'ui:required': formData =>
        formData.mailingAddress['view:livesOnMilitaryBase'] ||
        formData.mailingAddress.country === USA,
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: formData =>
          !formData.mailingAddress['view:livesOnMilitaryBase'] &&
          formData.mailingAddress.country !== USA,
      },
    },
  },
  // 'view:hasForwardingAddress': {
  //   'ui:title': 'My address will be changing soon.',
  // },
  // forwardingAddress: merge(
  //   addressUISchema(ADDRESS_PATHS.forwardingAddress, 'Forwarding address'),
  //   {
  //     'ui:field': ReviewCardField,
  //     'ui:subtitle': forwardingAddressDescription,
  //     'ui:order': [
  //       'effectiveDate',
  //       'country',
  //       'addressLine1',
  //       'addressLine2',
  //       'addressLine3',
  //       'city',
  //       'state',
  //       'zipCode',
  //     ],
  //     'ui:options': {
  //       viewComponent: ForwardingAddressViewField,
  //       expandUnder: 'view:hasForwardingAddress',
  //     },
  //     effectiveDate: merge(
  //       dateRangeUI(
  //         'Start date',
  //         'End date (optional)',
  //         'End date must be after start date',
  //       ),
  //       {
  //         from: {
  //           'ui:required': hasForwardingAddress,
  //           'ui:validations': [isInFuture],
  //         },
  //       },
  //     ),
  //     country: {
  //       'ui:required': hasForwardingAddress,
  //     },
  //     addressLine1: {
  //       'ui:required': hasForwardingAddress,
  //     },
  //     city: {
  //       'ui:required': hasForwardingAddress,
  //     },
  //     state: {
  //       'ui:required': formData =>
  //         hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
  //     },
  //     zipCode: {
  //       'ui:required': formData =>
  //         hasForwardingAddress(formData) && forwardingCountryIsUSA(formData),
  //     },
  //   },
  // ),
  'view:contactInfoDescription': {
    'ui:description': contactInfoUpdateHelp,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail,
    mailingAddress,
    // 'view:hasForwardingAddress': {
    //   type: 'boolean',
    // },
    // forwardingAddress,
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
