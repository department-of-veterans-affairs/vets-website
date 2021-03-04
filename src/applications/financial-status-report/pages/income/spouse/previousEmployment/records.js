import ItemLoop from '../../../../components/ItemLoop';
import CardDetailsView from '../../../../components/CardDetailsView';

export const uiSchema = {
  'ui:title': 'Your spouse information',
  employment: {
    'ui:options': {
      classNames: 'vads-u-margin-top--2',
    },
    spouse: {
      previousEmploymentRecords: {
        'ui:field': ItemLoop,
        'ui:description':
          'Tell us about your spouse’s other jobs in the past 2 years.',
        'ui:options': {
          viewField: CardDetailsView,
          doNotScroll: true,
          showSave: true,
          itemName: 'a job',
        },
        items: {
          'ui:options': {
            classNames: 'vads-u-margin-bottom--3',
          },
          previousEmploymentType: {
            'ui:title': 'Type of work',
            'ui:options': {
              widgetClassNames: 'input-size-3',
            },
          },
          previousEmploymentStart: {
            'ui:title': 'Date your spouse started work at this job',
            'ui:widget': 'date',
          },
          previousEmploymentEnd: {
            'ui:title': 'Date your spouse stopped work at this job',
            'ui:widget': 'date',
          },
          previousEmployerName: {
            'ui:title': 'Employer name',
            'ui:options': {
              classNames: 'vads-u-margin-top--3',
              widgetClassNames: 'input-size-6',
            },
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
        spouse: {
          type: 'object',
          properties: {
            previousEmploymentRecords: {
              type: 'array',
              items: {
                type: 'object',
                title: 'Previous employment',
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
    },
  },
};
