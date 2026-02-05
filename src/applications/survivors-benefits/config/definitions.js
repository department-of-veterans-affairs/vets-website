// TODO: Replace with our version of scheme when ready.
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import * as address from '@department-of-veterans-affairs/platform-forms-system/address';
import {
  STATE_NAMES,
  STATE_VALUES,
  COUNTRY_NAMES,
  COUNTRY_VALUES,
} from '../utils/labels';

export const {
  spouseDateOfBirth,
  spouseSocialSecurityNumber,
  spouseVaFileNumber,
  liveWithSpouse,
  spouseIsVeteran,
  netWorthEstimation,
} = fullSchemaPensions.properties;

export const {
  fullName,
  usaPhone,
  dateRange,
  date,
  monthlyIncome,
  netWorth,
  marriages,
  expectedIncome,
  ssn,
  centralMailVaFile,
  bankAccount,
  files,
} = fullSchemaPensions.definitions;

export const defaultDefinitions = {
  address: address.schema(fullSchemaPensions, false, 'profileAddress'),
  date,
  dateRange,
  usaPhone,
  fullName,
  ssn,
  centralMailVaFile,
  monthlyIncome,
  expectedIncome,
  netWorth,
};

export const customAddressSchema = {
  type: 'object',
  required: ['city'],
  properties: {
    city: {
      type: 'string',
      maxLength: 100,
    },
    state: {
      type: 'string',
      enum: STATE_VALUES,
      enumNames: STATE_NAMES,
      maxLength: 100,
    },
    otherCountry: {
      type: 'string',
      enum: COUNTRY_VALUES,
      enumNames: COUNTRY_NAMES,
      maxLength: 100,
    },
  },
};
