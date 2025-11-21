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
    ...titleUI('Veteran and spouse identification'),
    veteran: {
      fullName: fullNameUI(),
      ssn: ssnUI("Veteran's Social Security number"),
      vaFileNumber: textUI('VA file number (if applicable)'),
    },
    spouse: {
      fullName: fullNameUI(),
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
      spouse: {
        type: 'object',
        properties: {
          fullName: fullNameSchema,
        },
        required: ['fullName'],
      },
    },
    required: ['veteran', 'spouse'],
  },
};
