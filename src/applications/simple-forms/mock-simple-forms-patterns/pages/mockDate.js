import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  currentOrPastDateUI as currentOrPastDateUIWC,
  currentOrPastDateSchema,
  inlineTitleSchema,
  inlineTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
    dateDefault: currentOrPastDateUI('RJSF - Date of birth'),
    'view:inlineTitle': inlineTitleUI('V3 web components'),
    dateWCV3: currentOrPastDateUIWC('WC V3 - Date of birth'),
  },
  schema: {
    type: 'object',
    properties: {
      dateDefault: {
        $ref: '#/definitions/date',
      },
      'view:inlineTitle': inlineTitleSchema,
      dateWCV3: currentOrPastDateSchema,
    },
    required: ['dateDefault', 'dateWCV3'],
  },
};
