import {
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Dependent’s custodian'),
    custodianFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      custodianFullName: fullNameSchema,
    },
    required: ['custodianFullName'],
  },
};
