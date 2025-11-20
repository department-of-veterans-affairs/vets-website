import {
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone numbers'),
    witnessDaytimePhone: phoneUI('Daytime telephone number'),
    witnessEveningPhone: phoneUI('Evening telephone number'),
  },
  schema: {
    type: 'object',
    properties: {
      witnessDaytimePhone: phoneSchema,
      witnessEveningPhone: phoneSchema,
    },
    required: [],
  },
};
