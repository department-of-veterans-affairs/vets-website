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
          'ui:options': {
            widgetClassNames: 'input-size-3',
          },
          'ui:required': formData =>
            formData.previousEmploymentHistory.hasPreviousEmployment === true,
        },
        previousEmploymentStart: {
          'ui:title': 'Employment start date',
          'ui:widget': 'date',
          'ui:required': formData =>
            formData.previousEmploymentHistory.hasPreviousEmployment === true,
        },
        previousEmploymentEnd: {
          'ui:title': 'Employment end date',
          'ui:widget': 'date',
          'ui:required': formData =>
            formData.previousEmploymentHistory.hasPreviousEmployment === true,
        },
        previousEmployerName: {
          'ui:title': 'Employer name',
          'ui:options': {
            widgetClassNames: 'input-size-6',
          },
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
            required: [
              'previousEmploymentType',
              'previousEmploymentStart',
              'previousEmploymentEnd',
            ],
            properties: {
              previousEmploymentType: {
                type: 'string',
                enum: ['Full time', 'Part time', 'Seasonal', 'Temporary'],
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
