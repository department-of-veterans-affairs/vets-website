import {
  emailUI as emailOldUI,
  ssnUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import phoneOldUI from 'platform/forms-system/src/js/definitions/phone';
import {
  ssnUI as ssnNewUI,
  ssnSchema as ssnNewSchema,
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
    ...titleUI('RJSF'),
    emailOld: {
      ...emailOldUI(),
      'ui:title': 'TextWidget - emailUI',
    },
    phoneOld: phoneOldUI('TextWidget - phoneUI'),
    ssnOld: {
      ...ssnUI(),
      'ui:title': 'TextWidget - ssnUI',
    },
    'view:wcv3Title': inlineTitleUI('Web component v3'),
    wcv3TextEmailNew: emailUI({
      description:
        'By providing an email address, I agree to receive electronic correspondence from VA regarding my application',
    }),
    wcv3TextPhoneNew: phoneUI(),
    wcv3TextSsnNew: ssnNewUI(),
  },
  schema: {
    type: 'object',
    properties: {
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
      'view:wcv3Title': inlineTitleSchema,
      wcv3TextEmailNew: emailSchema,
      wcv3TextPhoneNew: phoneSchema,
      wcv3TextSsnNew: ssnNewSchema,
    },
    required: ['wcv3TextEmailNew'],
  },
};
