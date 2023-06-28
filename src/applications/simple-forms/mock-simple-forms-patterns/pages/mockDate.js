import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  currentOrPastDateUI as currentOrPastDateUIWC,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns';
import {
  inlineTitleSchema,
  inlineTitleUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsfTitle: titleUI('RJSF'),
    dateDefault: currentOrPastDateUI('RJSF - Date of birth'),
    wcv3Title: inlineTitleUI('V3 web components'),
    dateWCV3: currentOrPastDateUIWC('WC V3 - Date of birth'),
  },
  schema: {
    type: 'object',
    properties: {
      rjsfTitle: titleSchema,
      dateDefault: {
        $ref: '#/definitions/date',
      },
      wcv3Title: inlineTitleSchema,
      dateWCV3: currentOrPastDateSchema,
    },
    required: ['dateDefault', 'dateWCV3'],
  },
};
