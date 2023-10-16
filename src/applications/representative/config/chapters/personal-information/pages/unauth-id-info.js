import ssnUI from '@department-of-veterans-affairs/platform-forms-system/ssn';

export const title = 'Veteran’s Identification Information';

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
  },
  required: ['ssn'],
};

export const uiSchema = {
  ssn: ssnUI,
  vaFileNumber: {},
  serviceNumber: {},
};
