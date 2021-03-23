import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import monthYearUI from 'platform/forms-system/src/js/definitions/monthYear';

export const uiSchema = {
  'ui:title': 'Your work history',
  personalData: {
    employmentHistory: {
      'ui:options': {
        classNames: 'vads-u-margin-top--2',
      },
      veteran: {
        previousEmployment: {
          'ui:field': ItemLoop,
          'ui:description':
            'Tell us about your other jobs in the past 2 years.',
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
            type: {
              'ui:title': 'Type of work',
              'ui:options': {
                widgetClassNames: 'input-size-3',
              },
            },
            from: monthYearUI('Date you started work at this job'),
            to: monthYearUI('Date you stopped work at this job'),
            employerName: {
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
  },
};
export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        employmentHistory: {
          type: 'object',
          properties: {
            veteran: {
              type: 'object',
              properties: {
                previousEmployment: {
                  type: 'array',
                  items: {
                    type: 'object',
                    title: 'Previous employment',
                    required: ['type', 'from', 'to'],
                    properties: {
                      type: {
                        type: 'string',
                        enum: [
                          'Full time',
                          'Part time',
                          'Seasonal',
                          'Temporary',
                        ],
                      },
                      from: {
                        type: 'string',
                      },
                      to: {
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
    },
  },
};
