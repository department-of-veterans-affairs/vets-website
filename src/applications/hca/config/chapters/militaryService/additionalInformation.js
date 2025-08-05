import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const {
  disabledInLineOfDuty,
  isFormerPow,
  postNov111998Combat,
  purpleHeartRecipient,
  swAsiaCombat,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['service-info--history-title'],
      content['service-info--history-description'],
    ),
    'view:serviceHistory': {
      purpleHeartRecipient: {
        'ui:title': content['service-info--history-purple-heart-label'],
      },
      isFormerPow: {
        'ui:title': content['service-info--history-pow-label'],
      },
      postNov111998Combat: {
        'ui:title': content['service-info--history-combat-theater-label'],
      },
      disabledInLineOfDuty: {
        'ui:title': content['service-info--history-disability-label'],
      },
      swAsiaCombat: {
        'ui:title': content['service-info--history-sw-asia-label'],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:serviceHistory': {
        type: 'object',
        properties: {
          purpleHeartRecipient,
          isFormerPow,
          postNov111998Combat,
          disabledInLineOfDuty,
          swAsiaCombat,
        },
      },
    },
  },
};
