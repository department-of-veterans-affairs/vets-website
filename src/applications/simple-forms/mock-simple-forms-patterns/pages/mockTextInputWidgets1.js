import {
  emailUI as emailOldUI,
  ssnUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import phoneOldUI from 'platform/forms-system/src/js/definitions/phone';
import {
  ssnUI as ssnNewUI,
  ssnSchema as ssnNewSchema,
  titleSchema,
  titleUI,
  emailUI,
  emailSchema,
  phoneSchema,
  phoneUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI('RJSF'),
    emailOld: {
      ...emailOldUI(),
      'ui:title': 'TextWidget - emailUI',
    },
    phoneOld: phoneOldUI('TextWidget - phoneUI'),
    ssnOld: {
      ...ssnUI(),
      'ui:title': 'TextWidget - ssnUI',
    },
    'view:wcTitle': inlineTitleUI('Web component'),
    wcOldTextEmail: {
      ...emailUI('VaTextInputField - emailUI'),
      'ui:options': {
        uswds: false,
      },
    },
    wcOldTextPhone: {
      ...phoneUI('VaTextInputField - phoneUI'),
      'ui:options': {
        uswds: false,
      },
    },
    wcOldTextSsn: {
      ...ssnNewUI(),
      'ui:options': {
        uswds: false,
      },
    },
    'view:wcv3Title': inlineTitleUI('Web component v3'),
    wcv3TextEmailNew: emailUI(null, true),
    wcv3TextPhoneNew: phoneUI('VaTextInputField - phoneUI'),
    wcv3TextSsnNew: ssnNewUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      emailOld: {
        type: 'string',
        pattern: '^\\S+@\\S+$',
      },
      phoneOld: {
        type: 'string',
        minLength: 10,
      },
      ssnOld: {
        type: 'string',
        pattern: '^[0-9]{9}$',
      },
      'view:wcTitle': inlineTitleSchema,
      wcOldTextEmail: emailSchema,
      wcOldTextPhone: phoneSchema,
      wcOldTextSsn: ssnNewSchema,
      'view:wcv3Title': inlineTitleSchema,
      wcv3TextEmailNew: emailSchema,
      wcv3TextPhoneNew: phoneSchema,
      wcv3TextSsnNew: ssnNewSchema,
    },
    required: [],
  },
};
