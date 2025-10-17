// TODO: Replace with our version of scheme when ready.
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import * as address from '@department-of-veterans-affairs/platform-forms-system/address';
import { fullNameUI } from 'platform/forms-system/src/js/web-component-patterns';
import { merge } from 'lodash';

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
  benefitsIntakeFullName,
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
  benefitsIntakeFullName,
};

export const prefixedFullNameUI = ({ label, hint }) =>
  merge({}, fullNameUI(title => `${label} ${title}`), {
    first: {
      'ui:options': {
        hint,
      },
    },
  });

export const fullNameNotRequired = {
  type: 'object',
  properties: {
    first: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    middle: {
      type: 'string',
      maxLength: 30,
    },
    last: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    suffix: {
      type: 'string',
      enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
    },
  },
};
