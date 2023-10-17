import { mapValues } from 'lodash';

import ssnUI from '@department-of-veterans-affairs/platform-forms-system/ssn';

export const title = 'Veteran’s Identification Information';

const branchOfServiceOptions = {
  army: 'Army',
  airForce: 'Air Force',
  coastGuard: 'Coast Guard',
  marineCorps: 'Marine Corps',
  navy: 'Navy',
  spaceForce: 'Space Force',
  other: 'Other',
};

const createBooleanSchemaPropertiesFromOptions = obj =>
  mapValues(obj, () => {
    return { type: 'boolean' };
  });

const createUiTitlePropertiesFromOptions = obj => {
  return Object.entries(obj).reduce((accumulator, [key, value]) => {
    accumulator[key] = { 'ui:title': value };
    return accumulator;
  }, {});
};

export const schema = {
  type: 'object',
  title,
  properties: {
    ssn: {
      type: 'string',
      pattern: '^[0-9]{9}$',
    },
    vaFileNumber: {
      type: 'string',
      title: 'VA file number',
    },
    serviceNumber: {
      type: 'string',
      title: 'Service number',
    },
    branchOfService: {
      type: 'object',
      properties: {
        ...createBooleanSchemaPropertiesFromOptions(branchOfServiceOptions),
      },
      required: [],
    },
  },
  required: ['ssn'],
};

export const uiSchema = {
  ssn: ssnUI,
  vaFileNumber: {},
  serviceNumber: {},
  branchOfService: {
    'ui:description': 'Branch of Service',
    'ui:widget': 'checkbox',
    ...createUiTitlePropertiesFromOptions(branchOfServiceOptions),
    'ui:validations': [
      (errors, fieldData) => {
        const atLeastOneChecked = Object.values(fieldData).some(value => value);

        if (!atLeastOneChecked) {
          // eslint-disable-next-line no-console
          // console.log('Validation error triggered!');
          errors.addError('Please select at least one branch of service.');
        }
      },
    ],
    'ui:errorMessages': {
      pattern: 'Please select at least one branch of service.',
    },
  },
};
