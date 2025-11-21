import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Visitation information'),
    metVeteran: textUI('How often did you visit the Veteran?'),
    whenMetVet: textUI('Describe the occasions when you visited the Veteran'),
  },
  schema: {
    type: 'object',
    properties: {
      metVeteran: textSchema,
      whenMetVet: textSchema,
    },
    required: [],
  },
};
