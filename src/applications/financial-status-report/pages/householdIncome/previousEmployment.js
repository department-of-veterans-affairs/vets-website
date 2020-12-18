import ItemLoop from '../../components/ItemLoop';
import CardDetailsView from '../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your employment history',
  previousEmploymentHistory: {
    hasPreviousEmployment: {
      'ui:title': 'Have you had additional jobs in the past two years?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    previousEmploymentRecords: {
      'ui:field': ItemLoop,
      'ui:description':
        'Please provide your employment history for the past two years.',
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
        expandUnder: 'hasPreviousEmployment',
        itemName: 'Add a job',
      },
      items: {
        previousEmploymentType: {
          'ui:title': 'Type of employment',
        },
        previousEmploymentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
        },
        previousEmploymentEnd: {
          'ui:title': 'Employment end date',
          'ui:widget': 'date',
        },
        previousEmployerName: {
          'ui:title': 'Employer name',
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    previousEmploymentHistory: {
      type: 'object',
      properties: {
        hasPreviousEmployment: {
          type: 'boolean',
        },
        previousEmploymentRecords: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              previousEmploymentType: {
                type: 'string',
                enum: ['Full-time', 'Part-time', 'Seasonal'],
              },
              previousEmploymentStart: {
                type: 'string',
              },
              previousEmploymentEnd: {
                type: 'string',
              },
              previousEmployerName: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
