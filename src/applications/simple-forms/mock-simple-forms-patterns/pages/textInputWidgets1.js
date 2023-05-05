import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  emailUI,
  ssnUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  ssnUI as ssnNewUI,
  ssnSchema as ssnNewSchema,
} from 'platform/forms-system/src/js/web-component-patterns/ssnPattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    emailOld: {
      ...emailUI(),
      'ui:title': 'TextWidget - emailUI',
    },
    emailNew: {
      ...emailUI(),
      'ui:title': 'VaTextInputField - emailUI',
      'ui:webComponentField': VaTextInputField,
    },
    phoneOld: phoneUI('TextWidget - phoneUI'),
    phoneNew: {
      ...phoneUI('VaTextInputField - phoneUI'),
      'ui:webComponentField': VaTextInputField,
    },
    ssnOld: {
      ...ssnUI(),
      'ui:title': 'TextWidget - ssnUI',
    },
    ssnNew: ssnNewUI(),
  },
  schema: {
    type: 'object',
    properties: {
      emailOld: {
        type: 'string',
        pattern: '^\\S+@\\S+$',
        minLength: 3,
        maxLength: 10,
      },
      emailNew: {
        type: 'string',
        pattern: '^\\S+@\\S+$',
        minLength: 3,
        maxLength: 10,
      },
      phoneOld: {
        type: 'string',
        minLength: 10,
      },
      phoneNew: {
        type: 'string',
        minLength: 10,
      },
      ssnOld: {
        type: 'string',
        pattern: '^[0-9]{9}$',
      },
      ssnNew: ssnNewSchema(),
    },
    required: [],
  },
};
