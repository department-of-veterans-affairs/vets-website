// import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import content from '../../../locales/en/content.json';
import serviceHistoryDescription from '../../../components/FormDescriptions/ServiceHistoryDescription';

// const { isServiceHistoryCorrect } = ezrSchema.properties;

export default {
  uiSchema: {
    'ui:title': content['military-service-review-title'],
    'ui:description': serviceHistoryDescription,
    isServiceHistoryCorrect: {
      'ui:title': content['military-service-review-question'],
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isServiceHistoryCorrect'],
    properties: {
      'view:serviceHistorySummary': {
        type: 'object',
        properties: {},
      },
      isServiceHistoryCorrect: { type: 'boolean' },
    },
  },
};
