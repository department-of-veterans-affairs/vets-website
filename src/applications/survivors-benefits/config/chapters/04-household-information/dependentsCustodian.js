import {
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updatedFullNameSchema = fullNameSchema;
updatedFullNameSchema.properties.first.maxLength = 12;
updatedFullNameSchema.properties.last.maxLength = 18;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Dependent’s custodian'),
    custodianFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      custodianFullName: updatedFullNameSchema,
    },
    required: ['custodianFullName'],
  },
};
