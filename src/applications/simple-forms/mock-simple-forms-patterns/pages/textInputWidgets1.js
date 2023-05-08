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
import {
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('RJSF'),
    emailOld: {
      ...emailUI(),
      'ui:title': 'TextWidget - emailUI',
    },
    phoneOld: phoneUI('TextWidget - phoneUI'),
    ssnOld: {
      ...ssnUI(),
      'ui:title': 'TextWidget - ssnUI',
    },
    wc: titleUI('Web component', {
      classNames: 'vads-u-margin-top--4',
    }),
    emailNew: {
      ...emailUI(),
      'ui:title': 'VaTextInputField - emailUI',
      'ui:webComponentField': VaTextInputField,
    },
    phoneNew: {
      ...phoneUI('VaTextInputField - phoneUI'),
      'ui:webComponentField': VaTextInputField,
    },
    ssnNew: ssnNewUI(),
    wcv3: titleUI('Web component v3', {
      classNames: 'vads-u-margin-top--4',
    }),
    emailNewV3: {
      ...emailUI(),
      'ui:title': 'VaTextInputField - emailUI',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        uswds: true,
      },
    },
    phoneNewV3: {
      ...phoneUI('VaTextInputField - phoneUI'),
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        uswds: true,
      },
    },
    ssnNewV3: {
      ...ssnNewUI(),
      'ui:options': {
        uswds: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema(),
      emailOld: {
        type: 'string',
        pattern: '^\\S+@\\S+$',
        minLength: 3,
        maxLength: 10,
      },
      phoneOld: {
        type: 'string',
        minLength: 10,
      },
      ssnOld: {
        type: 'string',
        pattern: '^[0-9]{9}$',
      },
      wc: titleSchema(),
      emailNew: {
        type: 'string',
        pattern: '^\\S+@\\S+$',
        minLength: 3,
        maxLength: 10,
      },
      phoneNew: {
        type: 'string',
        minLength: 10,
      },
      ssnNew: ssnNewSchema(),
      wcv3: titleSchema(),
      emailNewV3: {
        type: 'string',
        pattern: '^\\S+@\\S+$',
        minLength: 3,
        maxLength: 10,
      },
      phoneNewV3: {
        type: 'string',
        minLength: 10,
      },
      ssnNewV3: ssnNewSchema(),
    },
    required: [],
  },
};
