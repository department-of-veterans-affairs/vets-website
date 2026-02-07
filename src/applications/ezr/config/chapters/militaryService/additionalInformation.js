import {
  titleUI,
  checkboxUI,
  checkboxSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(
      content['military-service-info-history-title'],
      content['military-service-info-history-description'],
    ),
    'view:serviceHistory': {
      purpleHeartRecipient: checkboxUI(
        content['service-info--history-purple-heart-label'],
      ),
      isFormerPow: checkboxUI(content['service-info--history-pow-label']),
      postNov111998Combat: checkboxUI(
        content['service-info--history-combat-theater-label'],
      ),
      disabledInLineOfDuty: checkboxUI(
        content['service-info--history-disability-label'],
      ),
      swAsiaCombat: checkboxUI(content['service-info--history-sw-asia-label']),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:serviceHistory': {
        type: 'object',
        properties: {
          purpleHeartRecipient: checkboxSchema,
          isFormerPow: checkboxSchema,
          postNov111998Combat: checkboxSchema,
          disabledInLineOfDuty: checkboxSchema,
          swAsiaCombat: checkboxSchema,
        },
      },
    },
  },
};
