import ItemLoop from '../components/ItemLoop';
import CardDetailsView from '../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  employmentHistory: {
    previousEmployment: {
      'ui:title': 'Has your spouse had additional jobs in the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    previousEmploymentRecords: {
      'ui:options': {
        expandUnder: 'previousEmployment',
        viewField: CardDetailsView,
      },
      'ui:description':
        'Please provide your spouse’s employment history for the past two years.',
      'ui:field': ItemLoop,
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
};

export const schema = {
  type: 'object',
  properties: {
    employmentHistory: {
      type: 'object',
      properties: {
        previousEmployment: {
          type: 'boolean',
        },
        previousEmploymentRecords: {
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
};
