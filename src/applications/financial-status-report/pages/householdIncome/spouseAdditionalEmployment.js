import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  employmentHistory: {
    previousEmployment: {
      'ui:title': 'Has your spouse had additional jobs in the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    previousEmploymentRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Please provide your spouse’s employment history for the past two years.',
      'ui:options': {
        expandUnder: 'previousEmployment',
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'Add a job',
      },
      items: {
        employmentType: {
          'ui:title': 'Type of employment',
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
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
                enum: ['Full time', 'Part time', 'Seasonal', 'Temporary'],
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
