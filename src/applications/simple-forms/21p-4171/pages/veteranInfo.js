import {
  fullNameSchema,
  fullNameUI,
  ssnSchema,
  ssnUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran information'),
    veteran: {
      fullName: fullNameUI(),
      ssn: ssnUI("Veteran's Social Security number"),
      vaFileNumber: textUI('VA file number (if applicable)'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteran: {
        type: 'object',
        properties: {
          fullName: fullNameSchema,
          ssn: ssnSchema,
          vaFileNumber: textSchema,
        },
        required: ['fullName', 'ssn'],
      },
    },
    required: ['veteran'],
  },
};
