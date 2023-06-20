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
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('RJSF'),
    emailOld: {
      ...emailOldUI(),
      'ui:title': 'TextWidget - emailUI',
    },
    phoneOld: phoneOldUI('TextWidget - phoneUI'),
    ssnOld: {
      ...ssnUI(),
      'ui:title': 'TextWidget - ssnUI',
    },
    wc: titleUI('Web component', {
      classNames: 'vads-u-margin-top--4',
    }),
    emailNew: {
      ...emailUI('VaTextInputField - emailUI'),
      'ui:options': {
        uswds: false,
      },
    },
    phoneNew: {
      ...phoneUI('VaTextInputField - phoneUI'),
      'ui:options': {
        uswds: false,
      },
    },
    ssnNew: {
      ...ssnNewUI(),
      'ui:options': {
        uswds: false,
      },
    },
    wcv3: titleUI('Web component v3', {
      classNames: 'vads-u-margin-top--4',
    }),
    emailNewV3: emailUI(null, true),
    phoneNewV3: phoneUI('VaTextInputField - phoneUI'),
    ssnNewV3: ssnNewUI(),
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
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
      wc: titleSchema,
      emailNew: emailSchema,
      phoneNew: phoneSchema,
      ssnNew: ssnNewSchema,
      wcv3: titleSchema,
      emailNewV3: emailSchema,
      phoneNewV3: phoneSchema,
      ssnNewV3: ssnNewSchema,
    },
    required: [],
  },
};
