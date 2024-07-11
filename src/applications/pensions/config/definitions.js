import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import * as address from '@department-of-veterans-affairs/platform-forms-system/address';

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
