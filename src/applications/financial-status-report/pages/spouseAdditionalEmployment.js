import ItemLoop from '../components/ItemLoop';
import AssetView from '../components/AssetView';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  employmentHistory: {
    hasBeenEmployed: {
      'ui:title': 'Has your spouse had additional jobs in the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    additionalEmployment: {
      'ui:options': {
        expandUnder: 'hasBeenEmployed',
      },
      'ui:description':
        'Please provide your spouse’s employment history for the past two years.',
      payrollDeductions: {
        'ui:field': ItemLoop,
        'ui:options': {
          viewField: AssetView,
        },
        items: {
          'ui:title': 'Add a job',
          employmentType: {
            'ui:title': 'Type of employment',
          },
          employmentStart: {
            'ui:title': 'Employment start date',
            'ui:widget': 'date',
            'ui:required': () => true,
          },
          employmentEnd: {
            'ui:title': 'Employment end date',
            'ui:widget': 'date',
            'ui:required': () => true,
          },
          employerName: {
            'ui:title': 'Employer name',
          },
        },
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
        hasBeenEmployed: {
          type: 'boolean',
        },
        additionalEmployment: {
          type: 'object',
          properties: {
            payrollDeductions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  employmentType: {
                    type: 'string',
                  },
                  employmentStart: {
                    type: 'string',
                  },
                  employmentEnd: {
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
  },
};
