import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';

import { ADDRESS_FORM_VALUES, FIELD_NAMES, USA } from 'vet360/constants';

// make an object of just the military state codes and names
const MILITARY_STATES = Object.entries(ADDRESS_DATA.states).reduce(
  (militaryStates, [stateCode, stateName]) => {
    if (ADDRESS_DATA.militaryStates.includes(stateCode)) {
      return {
        ...militaryStates,
        [stateCode]: stateName,
      };
    }
    return militaryStates;
  },
  {},
);

const STREET_LINE_MAX_LENGTH = 35;

const formSchema = {
  type: 'object',
  properties: {
    'view:livesOnMilitaryBase': {
      type: 'boolean',
    },
    'view:livesOnMilitaryBaseInfo': {
      type: 'object',
      properties: {},
    },
    countryCodeIso3: {
      type: 'string',
      enum: ADDRESS_FORM_VALUES.COUNTRY_ISO3_CODES,
      enumNames: ADDRESS_FORM_VALUES.COUNTRIES,
    },
    addressLine1: {
      type: 'string',
      minLength: 1,
      maxLength: STREET_LINE_MAX_LENGTH,
      pattern: '^.*\\S.*',
    },
    addressLine2: {
      type: 'string',
      minLength: 1,
      maxLength: STREET_LINE_MAX_LENGTH,
      pattern: '^.*\\S.*',
    },
    addressLine3: {
      type: 'string',
      minLength: 1,
      maxLength: STREET_LINE_MAX_LENGTH,
      pattern: '^.*\\S.*',
    },
    city: {
      type: 'string',
    },
    stateCode: {
      type: 'string',
      enum: Object.keys(ADDRESS_DATA.states),
      enumNames: Object.values(ADDRESS_DATA.states),
    },
    province: {
      type: 'string',
    },
    zipCode: {
      type: 'string',
      pattern: '^\\d{5}$',
    },
    internationalPostalCode: {
      type: 'string',
    },
  },
  required: ['countryCodeIso3', 'addressLine1', 'city'],
};

const uiSchema = {
  'view:livesOnMilitaryBase': {
    'ui:title':
      'I live on a United States military base outside of the United States.',
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
  countryCodeIso3: {
    'ui:title': 'Country',
    'ui:options': {
      updateSchema: formData => {
        if (formData['view:livesOnMilitaryBase']) {
          return {
            enum: [USA.COUNTRY_ISO3_CODE],
            enumNames: [USA.COUNTRY_NAME],
          };
        }
        return {
          enum: ADDRESS_FORM_VALUES.COUNTRY_ISO3_CODES,
          enumNames: ADDRESS_FORM_VALUES.COUNTRIES,
        };
      },
      updateUiSchema: formData => {
        if (formData['view:livesOnMilitaryBase']) {
          return {
            'ui:disabled': true,
          };
        }
        return {
          'ui:disabled': false,
        };
      },
    },
  },
  addressLine1: {
    'ui:title': `Street address (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:errorMessages': {
      required: 'Street address is required',
      pattern: `Street address must be under ${STREET_LINE_MAX_LENGTH} characters`,
    },
  },
  addressLine2: {
    'ui:title': `Street address (${STREET_LINE_MAX_LENGTH} characters maximum)`,
  },
  addressLine3: {
    'ui:title': `Street address (${STREET_LINE_MAX_LENGTH} characters maximum)`,
  },
  city: {
    'ui:errorMessages': {
      required: 'City is required',
      pattern: 'City must be under 100 characters',
    },
    'ui:options': {
      replaceSchema: formData => {
        if (formData['view:livesOnMilitaryBase'] === true) {
          return {
            type: 'string',
            title: 'APO/FPO/DPO',
            enum: ADDRESS_DATA.militaryCities,
          };
        }
        return {
          type: 'string',
          title: 'City',
          minLength: 1,
          maxLength: 100,
          pattern: '^.*\\S.*',
        };
      },
    },
  },
  stateCode: {
    'ui:title': 'State',
    'ui:errorMessages': {
      required: 'State is required',
    },
    'ui:options': {
      hideIf: formData => formData.countryCodeIso3 !== USA.COUNTRY_ISO3_CODE,
      updateSchema: formData => {
        if (formData['view:livesOnMilitaryBase']) {
          return {
            enum: Object.keys(MILITARY_STATES),
            enumNames: Object.values(MILITARY_STATES),
          };
        }
        return {
          enum: Object.keys(ADDRESS_DATA.states),
          enumNames: Object.values(ADDRESS_DATA.states),
        };
      },
    },
    'ui:required': formData =>
      formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
  },
  province: {
    'ui:title': 'State/Province/Region',
    'ui:options': {
      hideIf: formData => formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
    },
  },
  zipCode: {
    'ui:title': 'Zip code',
    'ui:errorMessages': {
      required: 'Zip code is required',
      pattern: 'Zip code must be 5 digits',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => formData.countryCodeIso3 !== USA.COUNTRY_ISO3_CODE,
    },
    'ui:required': formData =>
      formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
  },
  internationalPostalCode: {
    'ui:title': 'International postal code',
    'ui:errorMessages': {
      required: 'Postal code is required',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
    },
    'ui:required': formData =>
      formData.countryCodeIso3 !== USA.COUNTRY_ISO3_CODE,
  },
};

/**
 * Helper that returns the correct form schema object based on which address
 * field is being rendered
 */
export const getFormSchema = fieldName => {
  if (fieldName === FIELD_NAMES.MAILING_ADDRESS) {
    return cloneDeep(formSchema);
  }
  const schema = cloneDeep(formSchema);
  delete schema.properties['view:livesOnMilitaryBase'];
  delete schema.properties['view:livesOnMilitaryBaseInfo'];
  return schema;
};

/**
 * Helper that returns the correct ui schema object based on which address
 * field is being rendered
 */
export const getUiSchema = fieldName => {
  if (fieldName === FIELD_NAMES.MAILING_ADDRESS) {
    return cloneDeep(uiSchema);
  }
  const schema = cloneDeep(uiSchema);
  delete schema['view:livesOnMilitaryBase'];
  delete schema['view:livesOnMilitaryBaseInfo'];
  return schema;
};
