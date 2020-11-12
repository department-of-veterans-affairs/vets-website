import ListLoop from '../components/ListLoop';

export const uiSchema = {
  employmentHistory: {
    'ui:title': 'Your employment history',
    'view:hasBeenEmployed': {
      'ui:title': 'Have you been employed within the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    'view:isEmployed': {
      'ui:options': {
        expandUnder: 'view:hasBeenEmployed',
      },
      'view:currentlyEmployed': {
        'ui:title': 'Are you currently employed?',
        'ui:widget': 'yesNo',
        'ui:required': () => true,
      },
      'view:isCurrentlyEmployed': {
        'ui:options': {
          expandUnder: 'view:currentlyEmployed',
        },
        employmentType: {
          'ui:title': 'Type of employment',
        },
        employmentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
          'ui:required': () => true,
        },
        employerName: {
          'ui:title': 'Employer name',
        },
        'ui:field': ListLoop,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    employmentHistory: {
      type: 'object',
      properties: {
        'view:hasBeenEmployed': {
          type: 'boolean',
        },
        'view:isEmployed': {
          type: 'object',
          properties: {
            'view:currentlyEmployed': {
              type: 'boolean',
            },
            'view:isCurrentlyEmployed': {
              type: 'object',
              properties: {
                employmentType: {
                  type: 'string',
                  enum: ['Full-time', 'Part-time', 'Seasonal'],
                },
                employmentStart: {
                  type: 'string',
                },
                employerName: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};
