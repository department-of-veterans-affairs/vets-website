import {
  titleUI,
  arnOrVaFileNumberSchema,
  arnOrVaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your identification information'),
    nonCitizenId: arnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      nonCitizenId: arnOrVaFileNumberSchema,
    },
  },
};
