import ItemLoop from '../../../components/ItemLoop';
import CardDetailsView from '../../../components/CardDetailsView';
import EmploymentRecord from '../../../components/EmploymentRecord';

export const uiSchema = {
  'ui:title': 'Your work history',
  'ui:description':
    'Tell us about the jobs you’ve had in the past two years that you received paychecks for. You’ll need to provide your income information for any current job.',
  personalData: {
    employmentHistory: {
      veteran: {
        employmentRecords: {
          'ui:field': ItemLoop,
          'ui:options': {
            viewField: CardDetailsView,
            doNotScroll: true,
            showSave: true,
            itemName: 'job',
            keepInPageOnReview: true,
          },
          items: {
            'ui:field': EmploymentRecord,
            'ui:options': {
              classNames: 'vads-u-margin-bottom--3',
              userType: 'veteran',
              userArray: 'currentEmployment',
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
                employmentRecords: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['type', 'to', 'from', 'employerName'],
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
                      isCurrent: {
                        type: 'boolean',
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
