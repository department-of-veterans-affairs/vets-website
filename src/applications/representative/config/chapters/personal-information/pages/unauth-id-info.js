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

const branchOfServiceSchema = Object.keys(branchOfServiceOptions).reduce(
  (accumulator, key) => {
    accumulator[key] = { type: 'boolean', default: false };
    return accumulator;
  },
  {},
);

const branchOfServiceUiSchema = Object.keys(branchOfServiceOptions).reduce(
  (accumulator, key) => {
    accumulator[key] = {
      'ui:widget': 'checkbox',
      'ui:options': {
        hideLabelText: true,
      },
    };
    return accumulator;
  },
  {},
);

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
      properties: branchOfServiceSchema,
    },
  },
  required: ['ssn', 'branchOfService'],
};

export const uiSchema = {
  ssn: ssnUI,
  vaFileNumber: {},
  serviceNumber: {},
  branchOfService: {
    'ui:description': 'Branch of Service',
    ...branchOfServiceUiSchema,
  },
};
