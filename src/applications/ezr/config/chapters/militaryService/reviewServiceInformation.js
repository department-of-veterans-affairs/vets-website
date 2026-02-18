import {
  titleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';
import ServiceHistorySummary from '../../../components/FormDescriptions/ServiceHistoryDescription';

export default {
  uiSchema: {
    ...titleUI(
      content['military-service-review-title'],
      content['military-service-review-description'],
    ),
    ...descriptionUI(ServiceHistorySummary),
    isServiceHistoryCorrect: yesNoUI(
      content['military-service-review-question'],
    ),
  },
  schema: {
    type: 'object',
    required: ['isServiceHistoryCorrect'],
    properties: {
      isServiceHistoryCorrect: yesNoSchema,
    },
  },
};
