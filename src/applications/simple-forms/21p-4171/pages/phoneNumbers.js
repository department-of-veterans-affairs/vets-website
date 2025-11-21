import {
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone numbers'),
    daytimePhone: phoneUI('Daytime phone'),
    eveningPhone: phoneUI('Evening phone'),
  },
  schema: {
    type: 'object',
    properties: {
      daytimePhone: phoneSchema,
      eveningPhone: phoneSchema,
    },
    required: [],
  },
};
