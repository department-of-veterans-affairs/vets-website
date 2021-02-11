import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your work history',
  employment: {
    'ui:options': {
      classNames: 'previous-employment-container',
    },
    previousEmploymentRecords: {
      'ui:field': ItemLoop,
      'ui:description': 'Tell us about your other jobs in the past 2 years.',
      'ui:options': {
        viewField: CardDetailsView,
        doNotScroll: true,
        showSave: true,
        itemName: 'a job',
      },
      items: {
        previousEmploymentType: {
          'ui:title': 'Type of work',
          'ui:options': {
            classNames: 'work-type',
            widgetClassNames: 'input-size-3',
          },
        },
        previousEmploymentStart: {
          'ui:title': 'Date you started work at this job',
          'ui:widget': 'date',
        },
        previousEmploymentEnd: {
          'ui:title': 'Date you stopped work at this job',
          'ui:widget': 'date',
        },
        previousEmployerName: {
          'ui:title': 'Employer name',
          'ui:options': {
            classNames: 'employer-name',
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
    employment: {
      type: 'object',
      properties: {
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
