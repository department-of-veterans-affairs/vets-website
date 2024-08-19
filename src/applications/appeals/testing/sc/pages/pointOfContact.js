import {
  textUI,
  textSchema,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  pointOfContactTitle,
  pointOfContactNameLabel,
  pointOfContactPhoneLabel,
} from '../content/livingSituation';

export default {
  uiSchema: {
    'view:pointOfContact': {
      'ui:description': pointOfContactTitle,
    },
    pointOfContactName: textUI(pointOfContactNameLabel),
    pointOfContactPhone: phoneUI(pointOfContactPhoneLabel),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pointOfContact': {
        type: 'object',
        properties: {},
      },
      pointOfContactName: textSchema,
      pointOfContactPhone: phoneSchema,
    },
  },
};
