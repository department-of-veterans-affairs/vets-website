import {
  titleUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your identification information'),
    citizenId: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      citizenId: ssnOrVaFileNumberSchema,
    },
  },
};
