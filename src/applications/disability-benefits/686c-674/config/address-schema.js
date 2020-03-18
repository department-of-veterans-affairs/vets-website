import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import ADDRESS_DATA from 'platform/forms/address/data';

import { countries, states50AndDC, militaryCities } from './constants';
import { isChapterFieldRequired } from './helpers';

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

const USA = {
  value: 'USA',
  name: 'United States',
};

const militaryBaseInfo = () => (
  <div className="vads-u-padding-x--2p5">
    <AdditionalInfo
      status="info"
      triggerText="Learn more about military base addresses"
    >
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </AdditionalInfo>
  </div>
);

export const addressSchema = {
  type: 'object',
  properties: {
    'view:livesOnMilitaryBase': {
      type: 'boolean',
    },
    'view:livesOnMilitaryBaseInfo': {
      type: 'object',
      properties: {},
    },
    countryName: {
      type: 'string',
      enum: countries.map(country => country.label),
      default: USA.name,
    },
    addressLine1: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    addressLine2: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    addressLine3: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    city: {
      type: 'string',
    },
    stateCode: {
      type: 'string',
      enum: states50AndDC.map(state => state.value),
      enumNames: states50AndDC.map(state => state.label),
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
};

/*
* This method is resusable with the 686c-674, but could probably be extended for resuse elsewhere. 
* chapterKey is used uniquely inside the 686c to check for workflow requirements on individual fields.
* schemaKey is the corresponding schema property name for address. 
* isMilitaryBase toggles the militaryBase checkbox if the specific address doesn't need it.
*/
export const addressUISchema = (
  isMilitaryBase = false,
  schemaKey,
  chapterKey,
) => ({
  'view:livesOnMilitaryBase': {
    'ui:title':
      'I live on a United States military base outside of the United States',
    'ui:options': {
      hideIf: () => !isMilitaryBase,
    },
  },
  'view:livesOnMilitaryBaseInfo': {
    'ui:description': militaryBaseInfo,
    'ui:options': {
      hideIf: () => !isMilitaryBase,
    },
  },
  countryName: {
    'ui:required': formData => isChapterFieldRequired(formData, chapterKey),
    'ui:title': 'Country',
    'ui:options': {
      updateSchema: (formData, schema, uiSchema) => {
        const countryUI = uiSchema;
        const countryFormData = formData[`${schemaKey}`];
        if (
          isMilitaryBase &&
          formData[`${schemaKey}`]['view:livesOnMilitaryBase']
        ) {
          countryUI['ui:disabled'] = true;
          countryFormData.countryName = USA.name;
          return {
            enum: [USA.name],
            default: USA.name,
          };
        }
        countryUI['ui:disabled'] = false;
        return {
          type: 'string',
          enum: countries.map(country => country.label),
        };
      },
    },
  },
  addressLine1: {
    'ui:required': formData => isChapterFieldRequired(formData, chapterKey),
    'ui:title': 'Street address',
    'ui:errorMessages': {
      required: 'Street address is required',
      pattern: 'Street address must be under 100 characters',
    },
  },
  addressLine2: {
    'ui:title': 'Street address',
  },
  addressLine3: {
    'ui:title': 'Street address',
  },
  city: {
    'ui:required': formData => isChapterFieldRequired(formData, chapterKey),
    'ui:errorMessages': {
      required: 'City is required',
      pattern: 'City must be under 100 characters',
    },
    'ui:options': {
      replaceSchema: formData => {
        if (
          isMilitaryBase &&
          formData[`${schemaKey}`]['view:livesOnMilitaryBase'] === true
        ) {
          return {
            type: 'string',
            title: 'APO/FPO/DPO',
            enum: militaryCities,
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
    'ui:required': formData =>
      formData[`${schemaKey}`].countryName === USA.name ||
      formData[`${schemaKey}`]['view:livesOnMilitaryBase'],
    'ui:title': 'State',
    'ui:errorMessages': {
      required: 'State is required',
    },
    'ui:options': {
      hideIf: formData => {
        // Because we have to update countryName manually in formData above,
        // We have to check this when a user selects a non-US country and then selects
        // the military base checkbox.
        if (
          isMilitaryBase &&
          formData[`${schemaKey}`]['view:livesOnMilitaryBase']
        ) {
          return false;
        }
        return formData[`${schemaKey}`].countryName !== USA.name;
      },
      updateSchema: formData => {
        if (
          isMilitaryBase &&
          formData[`${schemaKey}`]['view:livesOnMilitaryBase']
        ) {
          return {
            enum: Object.keys(MILITARY_STATES),
            enumNames: Object.values(MILITARY_STATES),
          };
        }
        return {
          enum: states50AndDC.map(state => state.value),
          enumNames: states50AndDC.map(state => state.label),
        };
      },
    },
  },
  province: {
    'ui:title': 'State/Province/Region',
    'ui:options': {
      hideIf: formData => {
        if (
          isMilitaryBase &&
          formData[`${schemaKey}`]['view:livesOnMilitaryBase']
        ) {
          return true;
        }
        return formData[`${schemaKey}`].countryName === USA.name;
      },
    },
  },
  zipCode: {
    'ui:required': formData =>
      formData[`${schemaKey}`].countryName === USA.name ||
      (isMilitaryBase && formData[`${schemaKey}`]['view:livesOnMilitaryBase']),
    'ui:title': 'Zip Code',
    'ui:errorMessages': {
      required: 'Zip code is required',
      pattern: 'Zip code must be 5 digits',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => {
        // Because we have to update countryName manually in formData above,
        // We have to check this when a user selects a non-US country and then selects
        // the military base checkbox.
        if (
          isMilitaryBase &&
          formData[`${schemaKey}`]['view:livesOnMilitaryBase']
        ) {
          return false;
        }
        return formData[`${schemaKey}`].countryName !== USA.name;
      },
    },
  },
  internationalPostalCode: {
    'ui:required': formData =>
      formData[`${schemaKey}`].countryName !== USA.name,
    'ui:title': 'International postal code',
    'ui:errorMessages': {
      required: 'Postal code is required',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => {
        if (
          isMilitaryBase &&
          formData[`${schemaKey}`]['view:livesOnMilitaryBase']
        ) {
          return true;
        }
        return formData[`${schemaKey}`].countryName === USA.name;
      },
    },
  },
});
