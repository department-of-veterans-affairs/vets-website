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
    dateOfActivation: currentOrPastDateUI({
      title: 'Date of activation',
      monthSelect: false,
    }),
    unitName: textUI({
      title: 'Reserve or National Guard Unit name',
    }),
    unitPhoneNumber: internationalPhoneUI({
      title: 'Reserve or National Guard Unit primary phone number',
    }),
  },
  schema: {
    type: 'object',
    required: ['dateOfActivation', 'unitPhoneNumber', 'unitName'],
    properties: {
      dateOfActivation: currentOrPastDateSchema,
      unitName: textSchema,
      unitPhoneNumber: internationalPhoneSchema({ required: true }),
    },
  },
};
