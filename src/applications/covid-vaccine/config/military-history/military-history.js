export const schema = {
  militaryHistory: {
    type: 'object',
    properties: {
      lastBranchOfService: {
        type: 'string',
        enum: ['Army', 'Navy', 'Air Force'],
      },
      serviceStartYear: {
        type: 'string',
      },
      serviceEndYear: {
        type: 'string',
      },
      characterOfService: {
        type: 'string',
        enum: ['Something', 'Another thing'],
      },
    },
  },
};

export const uiSchema = {
  militaryHistory: {
    lastBranchOfService: {
      'ui:title': 'Last branch of service',
      'ui:required': () => {
        return true;
      },
    },
    serviceStartYear: {
      'ui:title': 'Service start year',
      'ui:required': () => {
        return true;
      },
    },
    serviceEndYear: {
      'ui:title': 'Service end year',
      'ui:required': () => {
        return true;
      },
    },
    characterOfService: {
      'ui:title': 'Character of service',
      'ui:required': () => {
        return true;
      },
    },
  },
};
