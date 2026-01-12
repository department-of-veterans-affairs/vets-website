import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('National Guard service period'),
    nationalGuardActivationDate: currentOrPastDateUI({
      title: 'Date of activation',
      monthSelect: false,
    }),
    unitName: textUI({
      title: 'Reserve or National Guard Unit name',
    }),
    unitPhone: internationalPhoneUI({
      title: 'Reserve or National Guard Unit primary phone number',
    }),
  },
  schema: {
    type: 'object',
    required: ['nationalGuardActivationDate', 'unitPhone', 'unitName'],
    properties: {
      nationalGuardActivationDate: currentOrPastDateSchema,
      unitName: textSchema,
      unitPhone: internationalPhoneSchema({ required: true }),
    },
  },
};
