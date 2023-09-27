import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

export const schema = {
  type: 'object',
  properties: {
    ssn: {
      type: 'string',
      pattern: '^[0-9]{9}$',
    },
    vaFileNumber: {
      type: 'string',
      title: 'Your VA file number',
    },
    serviceNumber: {
      type: 'string',
      title: 'Your Service number (if applicable)',
    },
    insuranceNumber: {
      type: 'string',
      title: 'Your insurance number (including the letters in front)',
    },
  },
  required: ['ssn'],
};

export const uiSchema = {
  ssn: ssnUI,
  vaFileNumber: {},
  serviceNumber: {},
  insuranceNumber: {},
};
