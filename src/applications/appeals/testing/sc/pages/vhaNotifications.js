import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  vhaNotificationDescription,
  vhaNotificationLabel,
  vhaNotificationHint,
  vhaNotificationChoices,
} from '../content/vhaNotifications';

export default {
  uiSchema: {
    'view:vhaContent': {
      'ui:description': vhaNotificationDescription,
    },
    vhaNotification: radioUI({
      title: vhaNotificationLabel,
      hint: vhaNotificationHint,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: vhaNotificationChoices,
      required: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:vhaContent': {
        type: 'object',
        properties: {},
      },
      vhaNotification: radioSchema(Object.keys(vhaNotificationChoices)),
    },
  },
};
