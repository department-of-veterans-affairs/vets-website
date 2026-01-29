import content from '../../../locales/en/content.json';
import serviceHistoryDescription from '../../../components/FormDescriptions/ServiceHistoryDescription';

export default {
  uiSchema: {
    'ui:title': content['military-service-review-title'],
    'ui:description': serviceHistoryDescription,
    'view:serviceHistoryCorrect': {
      'ui:title': content['military-service-review-question'],
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes',
          no: 'No',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['view:serviceHistoryCorrect'],
    properties: {
      'view:serviceHistorySummary': {
        type: 'object',
        properties: {},
      },
      'view:serviceHistoryCorrect': {
        type: 'string',
        enum: ['yes', 'no'],
      },
    },
  },
};
