import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  currentOrPastDateUI as currentOrPastDateUIWC,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns';
import {
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('RJSF'),
    dateDefault: currentOrPastDateUI('RJSF - Date of birth'),
    wc: titleUI('Web components', {
      classNames: 'vads-u-margin-top--4',
    }),
    dateWC: {
      ...currentOrPastDateUIWC('WC - Date of birth'),
      'ui:options': {
        uswds: false,
        classNames: 'vads-u-margin-top--0',
      },
    },
    wcv3: titleUI('V3 web components', {
      classNames: 'vads-u-margin-top--4',
    }),
    dateWCV3: {
      ...currentOrPastDateUIWC('WC V3 - Date of birth'),
      'ui:options': {
        classNames: 'vads-u-margin-top--0',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      dateDefault: {
        $ref: '#/definitions/date',
      },
      wc: {
        type: 'object',
        properties: {},
      },
      dateWC: currentOrPastDateSchema,
      wcv3: {
        type: 'object',
        properties: {},
      },
      dateWCV3: currentOrPastDateSchema,
    },
    required: [],
    // disabled for now - web component date intermittenly cannot select next field
    // required: ['dateWC', 'dateDefault', 'dateWCV3'],
  },
};
